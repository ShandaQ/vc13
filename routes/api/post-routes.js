const router = require('express').Router();
const sequelize = require('../../config/connection')
const { Post, User, Vote, Comment } = require('../../models');

// get list of of the post 
/* columns we want
* From Post model: id, post_url, title, created_at
* From User model: username
*/
router.get('/', (req, res) => {
    Post.findAll({
        order: [['created_at', 'DESC']], 
        attributes: ['id', 'post_url', 'title', 'created_at',
        [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
        ],
    
    //    using inlcude to join to the User model/table
        include: [
             // include the comments model 
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                // attach the username to the comment.
                include:{
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username']
            }
        ]
    }).then(dbPostData =>{
        res.json(dbPostData);
    }).catch(err =>{
        console.log(err);
        res.status(500).json(err);
    });
});

// returns a single post 
router.get('/:id', (req, res) =>{
    Post.findOne({
        // select post.id, post.post_url, post.title, post.create_at
        // user.username
        // from Post
        // inner join user 
        // on post.user_id = user.id
        where:{
            id: req.params.id
        },
        attributes: ['id', 'post_url', 'title', 'created_at',
            [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
        ],
        include: [
            {
                model:Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include:{
                    model: Post,
                    attributes: ['title']
                }

            },
            {
                model: User,
                attributes: ['username']
            }
        ]
    }).then(dbPostData =>{
        if(!dbPostData){
            res.status(404).json({message: "No Post found with this id"});
            return;
        }
        res.json(dbPostData);
    }).catch(err =>{
        console.log(err);
        res.status(500).json(err);
    });
});


// create a new post 
// pass in title, post_url, user_id
router.post('/', (req, res)=>{
    Post.create({
        title: req.body.title,
        post_url: req.body.post_url,
        user_id: req.body.user_id
    }).then(dbPostData =>{
        res.json(dbPostData);
    }).catch(err =>{
        console.log(err);
        res.status(500).json(err);
    });
});

router.put('/upvote', (req, res)=>{
    // custom static method creted in the models/post.js 
    Post.upvote(req.body, {Vote})
    .then(updatedPostData => res.json(updatedPostData))
    .catch(err =>{
        console.log(err);
        res.status(400).json(err);
    });
    // create the vote
/* Vote.create({
    user_id: req.body.user_id,
    post_id: req.body.post_id
  }).then(() => {
    // then find the post we just voted on
    return Post.findOne({
      where: {
        id: req.body.post_id
      },
      attributes: [
        'id',
        'post_url',
        'title',
        'created_at',
        // use raw MySQL aggregate function query to get a count of how many votes the post has and return it under the name `vote_count`
        [
          sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'),
          'vote_count'
        ]
      ]
    }).then(dbPostData => res.json(dbPostData))
}).catch(err => {
      console.log(err);
      res.status(400).json(err);
    }); */
});



// update a post title 
router.put('/:id', (req, res) =>{
    Post.update({
        title: req.body.title
    },
    {
        where: {
            id: req.params.id
        }
    }).then(dbPostData =>{
        if(!dbPostData){
            res.status(404).json({message: 'No post found with this id'});
            return;
        }
        res.json(dbPostData);
    }).catch(err =>{
         console.log(err);
        res.status(500).json(err);
    });
});

// delete a post 
router.delete('/:id', (req, res) =>{
    Post.destroy({
        where: {
            id: req.params.id
        }
        }).then(dbPostData =>{
        if(!dbPostData){
            res.status(404).json({message: 'No post found for that id'});
            return;
        }
        res.json(dbPostData);
    }).catch(err =>{
        res.status(500).json(err);
    });
});

// expose the changes to the router by exporting router
module.exports = router;
