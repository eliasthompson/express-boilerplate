const express = require('express');
// const cors = require('cors');
const bodyParser = require('body-parser');
const { NotFoundError } = require('common-errors');
// const { validateRequest } = services.get('jwt');

const { bindResponseFuctions, updateUserLastSeenAt, validateRequest } = require('../policies');

const router = express.Router();

// router.use(cors());
router.use(bodyParser.json());
router.use(validateRequest);
router.use(bindResponseFuctions);
router.use(updateUserLastSeenAt);

require('./user')(router);

router.get('/', (req, res) => res.success('API Online'));
router.use((req, res) => res.notFound(new NotFoundError('Route does not exist.')));

module.exports = { app: express(), router };
