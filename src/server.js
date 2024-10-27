// const express = require('express');
// const multer = require('multer'); // for file uploads
// const bodyParser = require('body-parser');
// const app = express();
// const PORT = 3000;

// // Middleware
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static('public')); // Serve static files

// // Set up storage for file uploads
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => cb(null, 'uploads/'),
//     filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
// });
// const upload = multer({ storage });

// // Handle form submission
// app.post('/submit-form', upload.single('file'), (req, res) => {
//     const { firstName, lastName, email, bio } = req.body;
//     const file = req.file;

//     // Store the data in a database or file here
//     console.log(`Name: ${firstName} ${lastName}, Email: ${email}, Bio: ${bio}, File: ${file.path}`);
//     res.send('Form submission successful!');
// });

// app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
