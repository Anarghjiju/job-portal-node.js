const express = require('express');
const mongoose = require('mongoose');
const app = express();
const axios = require('axios');

app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb://0.0.0.0:27017/test', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error(err));

// Job Schema
const jobSchema = new mongoose.Schema({
  jobId: String,
  jobName: String,
  jobDescription: String
});

const Job = mongoose.model('Job', jobSchema);

// Post a new Job
app.post('/jobs', async (req, res) => {
  const { jobId, jobName, jobDescription } = req.body;
  const job = new Job({ jobId, jobName, jobDescription });
  await job.save();
  res.status(201).send(job);
});

app.get('/jobs', async (req, res) => {
    try {
      const jobs = await Job.find(); // Fetch all jobs from the database
      res.json(jobs); // Send the jobs as a JSON response
    } catch (error) {
      res.status(500).json({ message: "Error fetching jobs", error });
    }
  });

// Get all Users applied for a specific Job (inter-service communication)
app.get('/jobs/applications', async (req, res) => {
    const { jobId } = req.query; // Get jobId from query parameters
    
    if (!jobId) {
      return res.status(400).json({ message: "jobId is required" });
    }
  
    try {
      // Call User service to get applications using jobId from query
      const response = await axios.get(`http://localhost:3001/applications/${jobId}`);
      res.json(response.data);
    } catch (error) {
      res.status(500).json({ message: "Error fetching applications", error });
    }
  });
  

app.listen(3000, () => {
  console.log('Admin Service running on port 3000');
});
