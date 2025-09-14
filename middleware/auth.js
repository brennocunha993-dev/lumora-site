const User = require('../models/User');

const requireAuth = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }
  next();
};

const requireRole = (roles) => {
  return async (req, res, next) => {
    if (!req.session.user) {
      return res.redirect('/auth/login');
    }
    
    const user = await User.findById(req.session.user._id);
    if (!user || !roles.includes(user.role)) {
      return res.status(403).render('error', { 
        message: 'Acesso negado',
        error: { status: 403 }
      });
    }
    
    req.user = user;
    next();
  };
};

const requireModerator = requireRole(['moderator', 'admin']);
const requireAdmin = requireRole(['admin']);

module.exports = {
  requireAuth,
  requireRole,
  requireModerator,
  requireAdmin
};