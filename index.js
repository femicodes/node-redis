const express = require('express');
const fetch = require('node-fetch');

const PORT = 5000;
const { setCache, checkCache } = require('./middleware');

const app = express();

const getRepos = async (req, res) => {
  try {
    console.log('fetching data .....')

    const { username } = req.params;
    const response = await fetch(`https://api.github.com/users/${username}`);

    const data = await response.json();

    const numberOfRepos = data.public_repos;

    setCache(username, numberOfRepos);

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

app.get('/repos/:username', checkCache, getRepos);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
})