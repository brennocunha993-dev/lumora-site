const express = require('express');
const Game = require('../models/Game');
const User = require('../models/User');
const { requireModerator, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Dashboard do moderador
router.get('/dashboard', requireModerator, async (req, res) => {
  try {
    const pendingGames = await Game.find({ approved: false })
      .populate('submittedBy', 'username')
      .sort({ createdAt: -1 });
    
    const stats = {
      totalGames: await Game.countDocuments(),
      pendingGames: await Game.countDocuments({ approved: false }),
      totalUsers: await User.countDocuments(),
      totalDownloads: await Game.aggregate([
        { $group: { _id: null, total: { $sum: '$downloads' } } }
      ])
    };
    
    res.render('admin/dashboard', { pendingGames, stats });
  } catch (error) {
    res.render('admin/dashboard', { pendingGames: [], stats: {} });
  }
});

// Aprovar jogo
router.post('/games/:id/approve', requireModerator, async (req, res) => {
  try {
    await Game.findByIdAndUpdate(req.params.id, { approved: true });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao aprovar jogo' });
  }
});

// Rejeitar jogo
router.post('/games/:id/reject', requireModerator, async (req, res) => {
  try {
    await Game.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao rejeitar jogo' });
  }
});

// Destacar jogo
router.post('/games/:id/feature', requireModerator, async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    game.featured = !game.featured;
    await game.save();
    res.json({ success: true, featured: game.featured });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao destacar jogo' });
  }
});

// Gerenciar usuários (apenas admin)
router.get('/users', requireAdmin, async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.render('admin/users', { users });
  } catch (error) {
    res.render('admin/users', { users: [] });
  }
});

// Alterar role do usuário
router.post('/users/:id/role', requireAdmin, async (req, res) => {
  try {
    const { role } = req.body;
    await User.findByIdAndUpdate(req.params.id, { role });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao alterar role' });
  }
});

// Banir/desbanir usuário
router.post('/users/:id/toggle-active', requireAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    user.isActive = !user.isActive;
    await user.save();
    res.json({ success: true, isActive: user.isActive });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao alterar status do usuário' });
  }
});

// Estatísticas detalhadas
router.get('/stats', requireModerator, async (req, res) => {
  try {
    const gamesByGenre = await Game.aggregate([
      { $match: { approved: true } },
      { $group: { _id: '$genre', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    const topGames = await Game.find({ approved: true })
      .sort({ downloads: -1 })
      .limit(10)
      .select('title downloads rating');
    
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('username createdAt role');
    
    res.render('admin/stats', { gamesByGenre, topGames, recentUsers });
  } catch (error) {
    res.render('admin/stats', { gamesByGenre: [], topGames: [], recentUsers: [] });
  }
});

module.exports = router;