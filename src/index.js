require('dotenv').config();
require('./models');
const { app, router } = require('./routes');

app.use('/', router);

app.listen(process.env.PORT || 8080);
