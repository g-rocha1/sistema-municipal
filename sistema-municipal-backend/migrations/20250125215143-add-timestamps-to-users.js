module.exports = {
  up: async (queryInterface, Sequelize) => {
      await queryInterface.sequelize.query(
          `UPDATE "Users" SET "created_at" = NOW(), "updated_at" = NOW() WHERE "created_at" IS NULL AND "updated_at" IS NULL;`
      );
      await queryInterface.addColumn('Users', 'created_at', {
          type: Sequelize.DATE,
          allowNull: false,
      });
      await queryInterface.addColumn('Users', 'updated_at', {
          type: Sequelize.DATE,
          allowNull: false,
      });
  },
  down: async (queryInterface, Sequelize) => {
      await queryInterface.removeColumn('Users', 'created_at');
      await queryInterface.removeColumn('Users', 'updated_at');
  },
};
