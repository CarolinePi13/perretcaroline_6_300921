const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');
const helmet = require("helmet");
const app = express();
const path =require('path');
const mongoSanitize = require('express-mongo-sanitize');
const xss= require('xss-clean');
const rateLimit = require("express-rate-limit");


mongoose.connect(`mongodb+srv://Caropi13:cNVf5U2yiXDUJPUN@cluster0.j0rpp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('connexion to MongoDb was successful!'))
  .catch(() => console.log('connexion to MongoDb failed!'));

app.use(express.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use(limiter);
app.use(helmet());
app.use(mongoSanitize());
app.use(xss());
app.use('/api/sauces', sauceRoutes)
app.use('/api/auth', userRoutes);
app.use('/images',express.static(path.join(__dirname, 'images')) );
module.exports = app;