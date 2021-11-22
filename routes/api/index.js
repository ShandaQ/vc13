// Hook Up the Server
// collect all of the API routes and package them up for us.

const router = require('express').Router();

const userRoutes = require('./user-routes.js');
const postRoutes = require('./post-routes.js');
const commentRoutes = require('./comment-routes');

// middleware
router.use('/users', userRoutes);
router.use('/posts', postRoutes);
router.use('/comments', commentRoutes);

module.exports = router;