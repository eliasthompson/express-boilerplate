const express = require('express');
// const cors = require('cors');
const bodyParser = require('body-parser');
const { NotFoundError } = require('common-errors');
// const validateRequest = services.get('jwt').validateRequest;

const { bindResponseFuctions } = require('../policies');

const router = express.Router();

// router.use(cors());
router.use(bodyParser.json());
// router.use(validateRequest);
router.use(bindResponseFuctions);
// router.use(updateUserLastSeenAt);

require('./user')(router);

router.get('/', (req, res) => {
  res.send({
    status: 'success',
    data: 'API Online',
  });
});

router.use((req, res) => {
  res.status(404).send({
    status: 'error',
    data: (new NotFoundError('Route does not exist.')).message,
  });
});

module.exports = { app: express(), router };
