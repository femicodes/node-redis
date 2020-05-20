const redis = require('redis');
const REDIS_PORT = 6379;
const client = redis.createClient(REDIS_PORT);

exports.checkCache = (req, res, next) => {
  const { username } = req.params

  client.get(username, (err, data) => {
    if (err) {
      res.status(500).json({
        message: "Something went wrong"
      })
    }

    if (!data) {
      next()
    } else {
      res.status(200).json({
        status: true,
        data: JSON.parse(data)
      })
    }
  });
};

exports.setCache = (key, data) => client.setex(key, '3600', JSON.stringify(data));

exports.deleteCache = (key) => client.del(key);