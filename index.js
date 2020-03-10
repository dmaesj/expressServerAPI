const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const morgan = require('morgan');
const router = require('./router');
const mongoose = require('mongoose');

// DB Setup
mongoose.connect('mongodb://localhost:auth/auth', 
    { 
        useNewUrlParser: true ,
        useUnifiedTopology: true,
        useCreateIndex: true
    });

const connection = mongoose.connection;

connection.on("connected", function() {
    console.log("connected to db")
});

// App Setup
 const app = express();
app.use(morgan('combined'));
app.use(bodyParser.json({ type: '*/*' }));
router(app);

// Server Setup
const port = process.env.PORT || 3090;
const server = http.createServer(app);
server.listen(port);
console.log('Server listening on:', port)