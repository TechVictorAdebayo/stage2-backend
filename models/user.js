const {DataTypes} = require ('sequelize');
const sequelize = require ('../config/database');

const User = sequelize.define('User', {
    userId: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull:false,
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    password:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    phone: {
        type:DataTypes.STRING,
    }
}, {
    timestamps: true,
});

User.associate = (models) => {
    User.belongsToMany(models.Organisation, { through: 'UserOrganisations' });
  };

module.exports = User;