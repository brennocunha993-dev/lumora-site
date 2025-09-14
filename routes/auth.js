const express = require('express');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const User = require('../models/User');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// Página de login
router.get('/login', (req, res) => {
  res.render('auth/login', { error: null });
});

// Processar login
router.post('/login', async (req, res) => {
  try {
    const { username, password, token } = req.body;
    
    const user = await User.findOne({
      $or: [{ username }, { email: username }]
    });
    
    if (!user || !await user.comparePassword(password)) {
      return res.render('auth/login', { error: 'Credenciais inválidas' });
    }
    
    // Verificar 2FA se habilitado
    if (user.twoFactorEnabled) {
      if (!token) {
        return res.render('auth/2fa', { userId: user._id });
      }
      
      const verified = speakeasy.totp.verify({
        secret: user.twoFactorSecret,
        encoding: 'base32',
        token,
        window: 2
      });
      
      if (!verified) {
        return res.render('auth/2fa', { 
          userId: user._id, 
          error: 'Código inválido' 
        });
      }
    }
    
    user.lastLogin = new Date();
    await user.save();
    
    req.session.user = user;
    res.redirect('/');
  } catch (error) {
    res.render('auth/login', { error: 'Erro interno do servidor' });
  }
});

// Página de registro
router.get('/register', (req, res) => {
  res.render('auth/register', { error: null });
});

// Processar registro
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;
    
    if (password !== confirmPassword) {
      return res.render('auth/register', { error: 'Senhas não coincidem' });
    }
    
    const existingUser = await User.findOne({
      $or: [{ username }, { email }]
    });
    
    if (existingUser) {
      return res.render('auth/register', { error: 'Usuário ou email já existe' });
    }
    
    const user = new User({ username, email, password });
    await user.save();
    
    req.session.user = user;
    res.redirect('/');
  } catch (error) {
    res.render('auth/register', { error: 'Erro ao criar conta' });
  }
});

// Configurar 2FA
router.get('/setup-2fa', requireAuth, async (req, res) => {
  try {
    const secret = speakeasy.generateSecret({
      name: `GamerSite (${req.session.user.username})`,
      issuer: 'GamerSite'
    });
    
    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);
    
    res.render('auth/setup-2fa', {
      secret: secret.base32,
      qrCode: qrCodeUrl
    });
  } catch (error) {
    res.redirect('/profile');
  }
});

// Confirmar 2FA
router.post('/confirm-2fa', requireAuth, async (req, res) => {
  try {
    const { secret, token } = req.body;
    
    const verified = speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token,
      window: 2
    });
    
    if (verified) {
      await User.findByIdAndUpdate(req.session.user._id, {
        twoFactorSecret: secret,
        twoFactorEnabled: true
      });
      
      res.json({ success: true });
    } else {
      res.json({ success: false, error: 'Código inválido' });
    }
  } catch (error) {
    res.json({ success: false, error: 'Erro interno' });
  }
});

// Logout
router.post('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;