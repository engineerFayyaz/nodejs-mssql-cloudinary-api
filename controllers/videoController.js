// controllers/videoController.js
const cloudinary = require('cloudinary').v2;
const mssql = require('mssql');

// Cloudinary config
cloudinary.config({
  cloud_name:'lms-empty' ,
  api_key: '465825886714436',
  api_secret: '_XtyARctyPki8NutUmKpElof_Cw',
});

async function uploadVideo(req, res) {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Upload video to Cloudinary
    const result = await cloudinary.uploader.upload(file.path);

    // Store video URL in MSSQL database
    const pool = await mssql.connect();
    const request = pool.request();
    const query = `INSERT INTO Videos (url) VALUES ('${result.secure_url}')`;
    await request.query(query);

    // Respond with success message
    res.json({ message: 'Video uploaded successfully', url: result.secure_url });
  } catch (error) {
    console.error('Error uploading video:', error);
    res.status(500).send('Internal Server Error');
  } finally {
    // Delete the uploaded file from the server
    // fs.unlinkSync(req.file.path);
  }
}

module.exports = { uploadVideo };
