const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const validator = require('validator');

const mongooseErrors = require('mongoose-errors')

//Model of the user object
const userSchema = mongoose.Schema({
  email: { 
    type: String, //only strings
    required: [true, 'please enter an email adress'],
    validate: [(value)=>{
      return validator.isEmail(value)
    },'Please enter a valid email'],// checks for email form validity
    lowercase: true,
    trim:true,//removes spaces
    unique: true  //can only be used once
  },
    password: { 
    type: String,
    required: true,
  }
});





userSchema.plugin(uniqueValidator);



module.exports = mongoose.model('User', userSchema);