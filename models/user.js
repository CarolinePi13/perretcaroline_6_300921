const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const validator = require('validator');
var passwordValidator = require('password-validator');
const bcrypt = require('bcrypt');


const userSchema = mongoose.Schema({
  email: { 
    type: String, 
    required: [true, 'please enter an email adress'],
    validate: [(value)=>{
      return validator.isEmail(value)
    },'Please enter a valid email'],
    lowercase: true,
    trim:true,
    unique: [true,'This email adress is already used for an account']  },
  password: { 
    type: String,
    required: true,
   
    
  }
});
userSchema.statics.login = async function(email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error('incorrect password');
  }
  throw Error('incorrect email')
};
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);