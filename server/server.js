
const fs = require('fs');
const path = require('path');
const express = require('express');
var app = express();
var cookieParser = require('cookie-parser');
const config = require('./.config.js')
const logger = require('./middleware/logger.js')
const MongoClient = require('mongodb').MongoClient;

// Setting to 3000
let port = 3001;

var voiceRouter = require('./apps/voice/routes.js');
var smsRouter = require('./apps/sms/routes.js');
var triageDataRouter = require('./apps/triageData/routes.js');

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//Initialize logger
app.use(logger);

//Connect Voice Routes
app.use('/voice', voiceRouter);
//Connect Sms Routes
app.use('/sms', smsRouter);
//Connect Triage Data Routes
app.use('/triageData', triageDataRouter);

var testData = [
{
  name: ' Aniya Brown',
  recording_url: ' audio.wav',
  priority : '5 severe'
},
{
  name: ' Matt Ground',
  recording_url: ' audiohelp.wav',
  priority: '2 severe'
}];

app.post('/api', function(req, res){
  res.send(JSON.stringify(testData))
});

//Serve react app build if in production
if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, '../client/build')));
// Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}
else{
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, '../client/public', 'index.html'));
  });
}



// Initialize DB connection and start server
MongoClient.connect(process.env.NODE_ENV === "production" ? config.production.database.url : config.development.database.url, { useUnifiedTopology: true }, function (err, database) {
  if (err) throw err;
  app.db = database.db('mentalhealthdb')
  // Save database object so the connection can be closed when server terminates.
  app.database = database;
  // Start the application after the database connection is ready
  app.server = app.listen(port);
  console.log(`Express JS server is istening on port ${port}`);
});

process.on('SIGTERM', shutDown);
process.on('SIGINT', shutDown);

// Close database connection and terminate server gracefully
function shutDown() {
  app.database.close();
  console.log("Closing db connection")
  app.server.close(() => {
    console.log('Terminating server');
    process.exit(0);
  });
}