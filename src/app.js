const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {

  const { title } = request.query;

  const result = title
    ? repositories.filter(repository => repository.title.includes(title))
    : repositories;

  return response.json(result);
});

app.post("/repositories", (request, response) => {

  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  }
  repositories.push(repository);

  return response.json(repository)
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const { title, url, techs } = request.body;

  const repositoryIndex = repositories.findIndex(repository => repository.id == id);

  if (repositoryIndex === -1) {
    return response.status(400).json({ error: 'Project not a found' });
  }

  const repository = {
    id,
    title,
    url,
    techs,
    likes: repositories[repositoryIndex].likes //Show the numbers of likes
  };

  repositories[repositoryIndex] + repository;
  return response.json(repository);

});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex > 0) {
    repositories.splice(repositoryIndex, 1);
  } else {
    return response.status(400).json({ error: 'Repository does not exists!' }) //400 = bad request
  }


  return response.status(204).send(); //204 = no content
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params; //Search id of request

  const repositoryIndex = repositories.findIndex(repository => repository.id === id); //Search for the repository that contains the same id for that scope

  if (repositoryIndex === -1) {
    return response.status(400).json({ error: 'Repository does not exists' }) // If the index does not exist, or is not found.
  };

  repositories[repositoryIndex].likes++ // look for the indexId of the repository, take the likes it contains and add 1 the sum of what I already had

  return response.json(repositories[repositoryIndex]);
});

module.exports = app;
