const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const axios = require('axios');

const app = express();
app.use(express.json());

// MySQL Connection
const sequelize = new Sequelize('test1', 'root', 'pass@word1', {
  host: 'localhost',
  port: 3306,
  dialect: 'mysql'
});

// Job Application Model
const JobApplication = sequelize.define('JobApplication', {
  jobId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  experience: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

// Sync MySQL database
sequelize.sync()
  .then(() => console.log('MySQL database synced'))
  .catch(err => console.error('Unable to sync database:', err));

// Register for a Job
app.post('/applications', async (req, res) => {
  const { jobId, name, experience } = req.body;
  const application = await JobApplication.create({ jobId, name, experience });
  res.status(201).send(application);
});

// Get All Job Applications for a specific Job
app.get('/applications/:jobId', async (req, res) => {
  const { jobId } = req.params;
  const applications = await JobApplication.findAll({ where: { jobId } });
  res.json(applications);
});

// Get All Jobs from Admin Service
app.get('/jobs', async (req, res) => {
  try {
    // Call Admin service to get all jobs
    const response = await axios.get('http://localhost:3000/jobs');
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching jobs", error });
  }
});

app.listen(3001, () => {
  console.log('User Service running on port 3001');
});
