const bcrypt =require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
var passwordValidator = require('password-validator');

var passwordSchema = new passwordValidator();
passwordSchema
.is().min(8)                                    // Minimum length 8
.is().max(20)                                  // Maximum length 20
.has().uppercase(1)                              // Must have uppercase letters
.has().lowercase(1)                              // Must have lowercase letters
.has().digits(1)                                // Must have at least 1 digit
.has().not().spaces()                           // Should not have spaces

exports.signup= (req, res, next) =>{
  if (passwordSchema.validate(req.body.password)){
bcrypt.hash(req.body.password, 10).then(
        (hash)=>{
            const user = new User({
                email: req.body.email,
                password: hash
            });
            user.save().then(
                ()=>{
                    res.status(201).json({
                        message: 'User added successfully!'
                    });
                }
            ).catch(
                error => {
                res.status(500).json({
                    error:error
                });
            })
        }
    );

  }else{
    return res.status(400).json('le mot de passe doit contenir au moins une majuscule, une min uscule, et un chiffre, il doit faire entre 8 et 20 caracteres')
  }
    
};

exports.login= (req, res, next) =>{
    User.findOne({ email: req.body.email}).then(
        (user) => {
            if (!user){
                return res.status(401).json({
                    error: new Error('User not found')
                });
            }
            bcrypt.compare(req.body.password, user.password).then(
                (valid)=>{
                    if (!valid){
                        return res.status(401).json({
                            error: new Error('Incorrect password !')
                        }); 
                    }
                const token = jwt.sign({userId :user._id}, 'RANDOM_TOKEN_SECRET',{expiresIn:'24h'});
                   res.status(200).json({
                       userId : user._id,
                       token:token
                   })
                }
            ).catch(
                (error)=>{
                    res.status(500).json({
                        error:error
                    });
                }
            );
        }
    ).catch(
        (error)=>{
            res.status(500).json({
                error:error
            });
        }
    );
}