const UserController = require('../controllers/user');

module.exports = function route(router) {
  const controller = new UserController();

  router.get('/users', controller.search.bind(controller));
  router.get('/users/settings', controller.searchSettings.bind(controller));
  router.put('/users/settings', controller.updateSettings.bind(controller));
  router.get('/users/team-members', controller.teamMembers.bind(controller));

  return router;
};
