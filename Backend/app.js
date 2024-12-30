const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const cors = require('cors');


const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(fileUpload({ useTempFiles: true, tempFileDir: '/tmp/' }));

// Routes
app.use('/auth', authRoutes);
app.use('/api', taskRoutes);

app.get("/", (req, res) => res.send("API is working!"));

// Start server
const PORT = process.env.PORT || 1100;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
