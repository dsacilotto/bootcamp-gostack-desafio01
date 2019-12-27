const express = require('express');
const server = express();

server.use(express.json());

var projects = [];
let requestCount = 0;

/**
 * Middleware to log total of requests
 */
function logRequest(req, res, next) {
  ++requestCount;
  const { url } = req;
  const { method } = req;

  console.log(`Request number: ${requestCount} on ${method} - ${url}`);

  return next();
}

server.use(logRequest);

/**
 * Middleware to check if a project exists
 */
function checkIfProjectExists(req, res, next) {
  const { id } = req.params;

  const index = projects.findIndex((p) => p.id === id);
  if (index === -1)
    return res.status(400).json({ error: 'Project does not exists' });

  req.index = index;

  return next();
}

/**
 * Project's endpoints
 */

// Return all projects
server.get('/projects', (req, res) => {
  return res.status(200).json(projects);
});

// Register a new project
server.post('/projects', (req, res) => {
  const { id } = req.body;
  const { title } = req.body;

  const project = {
    id,
    title,
    tasks: []
  };

  projects.push(project);

  return res.status(201).json(project);
});

// Update a project by id
server.put('/projects/:id', checkIfProjectExists, (req, res) => {
  const { title } = req.body;
  const index = req.index;

  const project = projects[index];
  project.title = title;

  return res.status(200).json(project);
});

// Delete a project by id
server.delete('/projects/:id', checkIfProjectExists, (req, res) => {
  const index = req.index;

  projects.splice(index, 1);

  return res.status(200).json(projects);
});

/**
 * Tasks endpoints
 */

// Add a new task in a project passing id
server.put('/projects/:id/tasks', checkIfProjectExists, (req, res) => {
  const { title } = req.body;
  const index = req.index;
  const project = projects[index];

  project.tasks.push(title);

  return res.status(200).json(project);
});

server.listen(3000);
