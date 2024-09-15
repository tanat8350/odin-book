const express = require('express');
const router = express.Router();

const postController = require('../controllers/postController');

router.get('/', postController.getPosts);
router.get('/all', postController.getAllPosts);
router.post('/', postController.postPost);
router.get('/:id', postController.getPost);
router.put('/:id/like', postController.putLikePost);
router.delete('/:id/like', postController.deleteUnlikePost);
router.post('/:id/comment', postController.postComment);

module.exports = router;
