const { DataTypes } = require ('sequelize');
const sequelize = require ('../config/database');

const Organisation = sequelize.define('Organisation',{
    orgId: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
    },
}, {
    timestamps: true,
});

Organisation.associate = (models) => {
    Organisation.belongsToMany(models.User, { through: 'UserOrganisations' });
  };

module.exports = Organisation;