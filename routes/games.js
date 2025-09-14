const express = require('express');
const multer = require('multer');
const path = require('path');
const Game = require('../models/Game');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// Configuração do multer para upload de imagens
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Apenas imagens são permitidas'));
    }
  }
});

// Listar jogos
router.get('/', async (req, res) => {
  try {
    const { genre, platform, search, sort = 'newest' } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = 12;
    
    let query = { approved: true };
    
    if (genre) query.genre = genre;
    if (platform) query.platform = { $in: [platform] };
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { developer: { $regex: search, $options: 'i' } }
      ];
    }
    
    let sortOption = {};
    switch (sort) {
      case 'rating': sortOption = { rating: -1 }; break;
      case 'downloads': sortOption = { downloads: -1 }; break;
      case 'price-low': sortOption = { price: 1 }; break;
      case 'price-high': sortOption = { price: -1 }; break;
      default: sortOption = { createdAt: -1 };
    }
    
    const games = await Game.find(query)
      .sort(sortOption)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('submittedBy', 'username');
    
    const total = await Game.countDocuments(query);
    
    res.render('games/list', {
      games,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      query: req.query
    });
  } catch (error) {
    res.render('games/list', { games: [], currentPage: 1, totalPages: 1, query: {} });
  }
});

// Detalhes do jogo
router.get('/:id', async (req, res) => {
  try {
    const game = await Game.findById(req.params.id)
      .populate('submittedBy', 'username')
      .populate('reviews.user', 'username');
    
    if (!game || !game.approved) {
      return res.status(404).render('error', { 
        message: 'Jogo não encontrado',
        error: { status: 404 }
      });
    }
    
    // Incrementar visualizações
    game.views += 1;
    await game.save();
    
    res.render('games/detail', { game });
  } catch (error) {
    res.status(404).render('error', { 
      message: 'Jogo não encontrado',
      error: { status: 404 }
    });
  }
});

// Formulário de submissão
router.get('/submit/new', requireAuth, (req, res) => {
  res.render('games/submit');
});

// Processar submissão
router.post('/submit', requireAuth, upload.array('images', 5), async (req, res) => {
  try {
    const gameData = {
      ...req.body,
      submittedBy: req.session.user._id,
      images: req.files ? req.files.map(file => '/uploads/' + file.filename) : [],
      platform: Array.isArray(req.body.platform) ? req.body.platform : [req.body.platform],
      tags: req.body.tags ? req.body.tags.split(',').map(tag => tag.trim()) : []
    };
    
    const game = new Game(gameData);
    await game.save();
    
    res.redirect('/games/' + game._id + '?submitted=true');
  } catch (error) {
    res.render('games/submit', { error: 'Erro ao submeter jogo' });
  }
});

// Adicionar review
router.post('/:id/review', requireAuth, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const game = await Game.findById(req.params.id);
    
    if (!game) {
      return res.status(404).json({ error: 'Jogo não encontrado' });
    }
    
    // Verificar se usuário já fez review
    const existingReview = game.reviews.find(
      review => review.user.toString() === req.session.user._id
    );
    
    if (existingReview) {
      return res.status(400).json({ error: 'Você já avaliou este jogo' });
    }
    
    game.reviews.push({
      user: req.session.user._id,
      rating: parseInt(rating),
      comment
    });
    
    // Recalcular rating médio
    const totalRating = game.reviews.reduce((sum, review) => sum + review.rating, 0);
    game.rating = totalRating / game.reviews.length;
    
    await game.save();
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Meus jogos - apenas jogos do usuário logado
router.get('/my-games', requireAuth, async (req, res) => {
  try {
    const games = await Game.find({ submittedBy: req.session.user._id })
      .sort({ createdAt: -1 })
      .populate('submittedBy', 'username');
    
    res.render('games/my-games', { games });
  } catch (error) {
    res.render('games/my-games', { games: [] });
  }
});

// Download do jogo
router.get('/:id/download', async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    
    if (!game || !game.approved || !game.downloadLink) {
      return res.status(404).json({ error: 'Download não disponível' });
    }
    
    game.downloads += 1;
    await game.save();
    
    res.redirect(game.downloadLink);
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;