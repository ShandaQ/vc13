const {Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const bcrypt = require('bcrypt');

// create user model 
class User extends Model {
    // set up method to run on instance data (per user) to check password
    checkPassword(loginPw) {
        // Using the keyword this, we can access this user's properties, including the password, which was stored as a hashed string.
        return bcrypt.compareSync(loginPw, this.password);
    }
}

// define table columns and config
User.init(
    { // table columns def
        // id column
        id: {
            // use the special Sequelize DataTypes object provide what type of data it is
            type: DataTypes.INTEGER,
            // this is the equivalent of SQL's `NOT NULL` option
            allowNull: false,
            // instruct that this is the Primary Key
            primaryKey: true,
            // turn on auto increment
            autoIncrement: true
        },
        // define a username column
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
         // define an email column
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            // there cannot be any duplicate email values in this table
            unique: true,
            // if allowNull is set to false, we can run our data through validators before creating the table data
            validate: {
                isEmail: true
            }
        },
        // define a password column
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
            // this means the password must be at least four characters long
            len: [4]
            }
        }
    },
    
    { // table configs goes here
        hooks: {
            // set up beforeCreate lifecycle "hook" functionality
            async beforeCreate(newUserData) {
                console.log("beforeCreate: here is the newUserData " + newUserData.password);
                newUserData.password = await bcrypt.hash(newUserData.password, 10);
                console.log("beforeCreate: bcrypyt the pwsd and here is the data " + newUserData.password);

                return newUserData;
            },
            // set up beforeUpdate lifecycle "hook" functionality
            async beforeUpdate(updatedUserData) {
                updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
                return updatedUserData;
            }
        },
        // pass in our imported sequelize connection (the direct connection to our database)
        sequelize,

        // don't automatically create createdAt/updatedAt timestamp fields
        timestamps: false,

        // don't pluralize name of database table
        freezeTableName: true,

        // use underscores instead of camel-casing (i.e. `comment_text` and not `commentText`)
        underscored: true,

        // make it so our model name stays lowercase in the database
        modelName: 'user'
    }
);

module.exports = User;



/*{ // hooks
        hooks: { // set up beforeCreate lifecycle "hook" functionality
            beforeCreate(userData) {
                return bcrypt.hash(userData.password, 10).then(newUserData => {
                    return newUserData
                });
            }
        }
    },*/

/* Internally, sequelize.define calls Model.init.
const User = sequelize.define('user', {
    id: {
        // use the special Sequelize DataTypes object provide what type of data it is
        type: DataTypes.INTEGER,
        // this is the equivalent of SQL's `NOT NULL` option
        allowNull: false,
        // instruct that this is the Primary Key
        primaryKey: true,
        // turn on auto increment
        autoIncrement: true
    },
    // define a username column
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    // define an email column
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        // there cannot be any duplicate email values in this table
        unique: true,
        // if allowNull is set to false, we can run our data through validators before creating the table data
        validate: {
            isEmail: true
        }
    },
    // define a password column
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            // this means the password must be at least four characters long
            len: [4]
        }
    }
},
        
    { // table configs goes here

        // pass in our imported sequelize connection (the direct connection to our database)
        sequelize,

        // don't automatically create createdAt/updatedAt timestamp fields
        timestamps: false,

        // don't pluralize name of database table
        freezeTableName: true,

        // use underscores instead of camel-casing (i.e. `comment_text` and not `commentText`)
        underscored: true,

        // make it so our model name stays lowercase in the database
        modelName: 'user'
    }

);*/