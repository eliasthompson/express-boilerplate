const UserController = require('../controllers/user');

module.exports = function route(router) {
  const controller = new UserController();

  router.get('/users', controller.search.bind(controller));
  router.put('/user', controller.update.bind(controller));
  router.delete('/user', controller.delete.bind(controller));

  return router;
};
