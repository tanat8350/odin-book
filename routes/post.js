const express = require('express');
const router = express.Router();

const postController = require('../controllers/postController');

router.get('/', postController.getPosts);
router.get('/all', postController.getAllPosts);
router.get('/search', postController.getSearchPosts);
router.post('/', postController.postPost);
router.get('/:id', postController.getPost);
router.post('/:id/repost', postController.postRepost);
router.get('/:id/repost/user', postController.getRepostedUsers);
router.put('/:id/like', postController.putLikePost);
router.delete('/:id/like', postController.deleteUnlikePost);
router.post('/:id/comment', postController.postComment);

module.exports = router;
