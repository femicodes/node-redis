const express = require('express');
const fetch = require('node-fetch');
const redis = require('redis');

const PORT = 5000;
const REDIS_PORT = 6379;

const client = redis.createClient(REDIS_PORT);

const app = express();

const getRepos = async (req, res) => {
  try {
    console.log('fetching data .....')

    const { username } = req.params;
    const response = await fetch(`https://api.github.com/users/${username}`);

    const data = await response.json();

    const numberOfRepos = data.public_repos;

    client.setex(username, 3600, numberOfRepos);

    res.status(200).json({
      status: true,
      repos: `${username} has ${numberOfRepos} repos`
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      message: 'An error occured'
    });
  }
};

const cache = (req, res, next) => {
  const { username } = req.params;

  client.get(username, (err, data) => {
    if (err) throw err;

    if (data) {
      console.log(data)
      res.status(200).json({
        status: true,
        repos: `${username} has ${data} repos`
      });
    }
    next();
  });
}

app.get('/repos/:username', cache, getRepos);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
})