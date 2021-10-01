const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/user');

const app = express();
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

mongoose.connect(`mongodb+srv://Caropi13:cNVf5U2yiXDUJPUN@cluster0.j0rpp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion to MongoDB failed !'))
  .catch(() => console.log('Connexion to MongoDB was successful!'));

app.use((req, res) => {
   res.json({ message: 'Your request was successful !' }); 
});
app.use(express.json());


app.use('/api/auth', userRoutes);

module.exports = app;