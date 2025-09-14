const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const path = require('path');

const authRoutes = require('./routes/auth');
const gameRoutes = require('./routes/games');
const adminRoutes = require('./routes/admin');

const app = express();

// Middleware de segurança
app.use(helmet());
app.use(cors());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // máximo 100 requests por IP
});
app.use(limiter);

// Configuração do MongoDB
mongoose.connect('mongodb://localhost:27017/gamersite', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Configuração do Express
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sessões
app.use(session({
  secret: 'gamer-secret-key-2023',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 24 horas
}));

// Middleware para variáveis globais
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// Rotas
app.use('/auth', authRoutes);
app.use('/games', gameRoutes);
app.use('/admin', adminRoutes);

// Rota principal
app.get('/', async (req, res) => {
  try {
    const Game = require('./models/Game');
    const games = await Game.find({ approved: true }).sort({ createdAt: -1 }).limit(12);
    res.render('index', { games });
  } catch (error) {
    res.render('index', { games: [] });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🎮 Servidor rodando na porta ${PORT}`);
});