module.exports = (sequelize, DataTypes) => {
    return sequelize.define('AuditLog', {
      action: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      entityType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      entityId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
    });
  };