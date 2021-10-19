const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


const sauceSchema = mongoose.Schema({
    userId:{
        type:String
    },
    name:{
        type:String, 
        required:true,
        unique:true,
        uniqueCaseInsensitive: true
        //cannot add twice the same sauce
    },

    manufacturer:{
        type:String,
        required:true,
        
    },
    description:{
        type:String,
        required:true,
        maxlength: [200,'this field cannnot contain more than 200 characters'],
        minlength: [5,'this field must contain at least 5 characters']
       
    },
    mainPepper:{
        type:String,
        required: true,
        maxlength:[50,'this field cannnot contain more than 50 characters'],
        
    },
    imageUrl:{
        type:String,
        required:true,
       
    },
    heat:{
        type:Number,
        required:true,
    },
    likes:{
        type:Number,
        default:0
    },
    dislikes:{
        type:Number,
        default:0
    },
    usersLiked:{
        type:[
            String
            ]
    },
    usersDisliked:{
        type:[
           String
            ]
    },
    
    
},{ emitIndexErrors: true});


var handleE11000 = function(error, res, next) {
    if (error.name === 'MongoServerError' && error.code === 11000) {
      next(new Error('There was a duplicate key error'));
    } else {
      next();
    }
  };

  sauceSchema.post('save', handleE11000);
  sauceSchema.post('update', handleE11000);
  sauceSchema.post('findOneAndUpdate', handleE11000);
  sauceSchema.post('insertMany', handleE11000);
sauceSchema.plugin(uniqueValidator, { message: `Error, expected {VALUE
} to be unique.`});

module.exports = mongoose.model("Sauce", sauceSchema);