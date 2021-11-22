const router = require('express').Router();
// const sequelize = require('../../config/connection')
const { Comment } = require('../../models');

router.get('/', (req, res) => {
    Comment.findAll({

    })
    .then(dbComment =>{
        res.json(dbComment)
    }).catch(err =>{
        console.log(err);
        res.status(400).json(err);
    })
});

router.post('/', (req, res) => {
    Comment.create({
        comment_text: req.body.comment_text,
        user_id: req.body.user_id,
        post_id: req.body.post_id,

    }).then(dbComment =>{
        res.json(dbComment)
    }).catch(err =>{
        console.log(err);
        res.status(400).json(err);
    });
});

router.delete('/:id', (req, res) => {
    Comment.destroy({
        where:{
            id: req.params.id
        }
    }).then(dbComment =>{
        if(!dbComment){
            res.status(404).json({message: 'No post found for that id'});
            return;
        }
        res.json(dbComment)
    }).catch(err =>{
        console.log(err);
        res.status(500).json(err);
    })
});



module.exports = router;