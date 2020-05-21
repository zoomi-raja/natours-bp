const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.post('/forgetPassword', authController.forgetPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.use(authController.protect);
router.get('/me', userController.getMe, userController.getUser);
router.patch('/udpateMe', userController.updateMe);
router.patch(
  '/photo',
  userController.uploadPhoto,
  userController.resizePhoto,
  userController.updatePhoto
);
router.patch('/UpdatePassword', authController.updatePassword);

router.use(authController.restrictTo('admin'));
router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
