const express = require('express');
const coursController = require('../controllers/courssController.js');
const upload = require('../middleware/upload.js');

const router = express.Router();

router.post('/', coursController.createCours);
router.post('/:id/upload-video', upload.single('video'), coursController.uploadVideo);
router.get('/:id/videos', coursController.getCourseVideos);
router.get('/', coursController.getAllCourses);

module.exports = router;
