const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUser);
router.delete('/:id', userController.deleteDeleteUser);
router.get('/:id/profile', userController.getUserProfile);
router.put('/:id/profile', userController.putUpdateUserProfile);
router.put('/:id/profile/image', userController.putUpdateUserProfileImage);
router.put('/:id/profile/password', userController.putUpdatePassword);
router.post('/:id/follow', userController.postFollowRequest);
router.delete('/:id/follow', userController.deleteUnfollow);
router.put('/:id/request', userController.putAcceptRequest);
router.delete('/:id/request', userController.deleteRejectRequest);

module.exports = router;
