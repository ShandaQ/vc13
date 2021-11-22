const express = require('express');
// The router instance in routes/index.js collected everything for us and packaged them up
const routes = require('./routes');
const sequelize = require('./config/connection');

const app = express();
const PORT = process.env.PORT || 3001;

// middleware
// parses incoming requests with JSON payloads and is based on body-parser.
app.use(express.json());
// It parses incoming requests with urlencoded payloads and is based on body-parser.
app.use(express.urlencoded({ extended: true }));

// turn on routes
app.use(routes);

// turn on connection to db and server
// method to establish the connection to the database
// Sequelize taking the models and connecting them to associated database tables. If it doesn't find a table, it'll create it for you!

// force: config parameter when set to TRUE the db connection must sync with the model definitions and asssociations. The tables will be recreated of there are any associations changes ->DROP TABLE IF EXISTS
// once you restart your server to sync the new assocations you can change force parameter back to false
// dropping the table also deletes any previous records
sequelize.sync({ force: false })
  .then(() => {
    app.listen(PORT, () => console.log('Now listening'));
});
