const Cours = require('../models/CoursS.js');
const path = require('path');
const fs = require('fs').promises;

const createCours = async (req, res) => {
    try {
        const cours = new Cours(req.body);
        await cours.save();
        res.status(201).json(cours);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getAllCourses = async (req, res) => {
  try {
    const courses = await Cours.find(); 
    const coursesData = [];

    for (const course of courses) {
      const videos = [];
      
      for (const video of course.videos) {
        const videoPath = path.join(__dirname, '..', video.videoUrl);
        console.log("Video path:", videoPath);
        try {
          await fs.access(videoPath); // Check if file exists
          const videoStream = fs.createReadStream(videoPath);
          videos.push(videoStream);
        } catch (error) {
          console.error("Video file not found:", videoPath);
        }
      }

      coursesData.push({
        _id: course._id,
        name: course.name,
        description: course.description,
        videos: videos, 
      });
    }

    res.writeHead(200, {
      'Content-Type': 'application/json',
    });

    res.end(JSON.stringify(coursesData));

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const uploadVideo = async (req, res) => {
  try {
    const course = await Cours.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    course.videos.push({ videoUrl: req.file.path });
    await course.save();

    res.status(200).json({ message: "Video uploaded successfully", course });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const getCourseVideos = async (req, res) => {
  try {
    const courseId = req.params.id;
    const course = await Cours.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const videoUrls = course.videos.map(video => {
      return {
        videoUrl: `${req.protocol}://${req.get('host')}/${video.videoUrl}`
      };
    });

    res.status(200).json(videoUrls);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  createCours,
  getAllCourses,
  uploadVideo,
  getCourseVideos,
};
