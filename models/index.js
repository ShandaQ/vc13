// collecting and exporting our models/schemas/tables to be used esle where in the app

const Post = require('./Post');
const User = require('./User');
const Vote = require('./Vote');
const Comment = require('./Comment');

// Create associations One User can have many Post
User.hasMany(Post, {
    foreignKey: 'user_id'
});
/* We also need to add in the reverse association*/
// Create association One post can have one user 
//  we declare the link to the foreign key, which is designated at user_id in the Post model.
Post.belongsTo(User, {
    foreignKey: 'user_id'
});


/*
belongsToMany - allows the User and Post models to query each other information in the context of vote
*/

/* See which uses votes on a post */
User.belongsToMany(Post, {
    through: Vote,
    as: 'voted_posts',
    foreignKey: 'user_id'
});

/* Which Post did a user vote on */
Post.belongsToMany(User, {
    through: Vote,
    as: 'voted_posts',
    foreignKey: 'post_id'
});

/* a vote belongs to a user */
Vote.belongsTo(User, {
    foreignKey: 'user_id'
});
/* a vote belongs to a post */
Vote.belongsTo(Post, {
    foreignKey: 'post_id'
});
/* a use can have many votes or vote many times */
User.hasMany(Vote, {
    foreignKey: 'user_id'
});
/* a post can have many votes */
Post.hasMany(Vote, {
    foreignKey: 'post_id'
});

// comments assoications 
Comment.belongsTo(User,{
    foreignKey: 'user_id'
})

Comment.belongsTo(Post, {
    foreignKey: 'post_id'
});

User.hasMany(Comment, {
    foreignKey: 'user_id'
});
  
Post.hasMany(Comment, {
    foreignKey: 'post_id'
});


module.exports = { User, Post, Vote, Comment };