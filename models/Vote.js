const {Model, DataTypes} = require('sequelize');
const sequelize = require('../config/connection');

class Vote extends Model{}

Vote.init(
    {
        id:{
            type: DataTypes.INTEGER,
            // allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        user_id:{
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'user',
                key: 'id'
            }
        },
        post_id:{
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'post',
                key: 'id'
            }
        }
    }, 
    {
        // pass in our imported sequelize connection (the direct connection to our database)
        sequelize,
        // don't automatically create createdAt/updatedAt timestamp fields
        timestamps: false,
        // don't pluralize name of database table
        freezeTableName: true,
        // use underscores instead of camel-casing (i.e. `comment_text` and not `commentText`)
        underscored: true,
        // make it so our model name stays lowercase in the database
        modelName: 'vote'
    }
);

module.exports = Vote;