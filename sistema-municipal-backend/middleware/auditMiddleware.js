const AuditLog = require('../models/auditLog');

function logAction(action, entityType) {
  return async (req, res, next) => {
    if (req.user) {
      await AuditLog.create({
        action,
        entityType,
        entityId: req.params.id || null,
        userId: req.user.id,
      });
    }
    next();
  };
}

module.exports = logAction;