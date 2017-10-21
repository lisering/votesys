'use strict';
module.exports = (sequelize, DataTypes) => {
  var VoteUser = sequelize.define('VoteUser', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return VoteUser;
};