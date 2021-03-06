const Sauce = require("../models/sauce");
const fs = require('fs');
const mongooseError = require('mongoose-error');
var MongoErrors = require('mongo-errors');
console.log(MongoErrors.DuplicateKey); // 11000


exports.createSauce= (req, res, next) =>{
//sends the object to the db in the appropriate format (string to object)
req.body.sauce=JSON.parse(req.body.sauce)

  const sauce = new Sauce({

   ...req.body.sauce,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,//sets the route to the images folder
  })
  
  sauce.save().then(// saves the object in the db
    () => 
      res.status(201).json({
        message: 'Sauce saved successfully!'
      }),(err) =>{
          console.error(err);
         res.status(403).json
         ({
             message:"erreur cette sauce existe deja"
         })
         const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink("images/"+ filename,()=>{
            Sauce.deleteOne({_id: sauce._id})
            .then(() => res.status(200).json({ message: 'image deleted'}))
            .catch(
                (error) =>{
                    res.status(400).json({
                        error:error
                    });
                });
        })


        //   throw mongooseError(err, {DuplicateKey: 'This sauce already exists'})
      }//catches duplicate key mongoose error
    
  ).catch(
    (error) => {
      res.status(400).json({
        error: error,
        message: 'something went wrong with the sauce creation'

      });
    }
  );
};
// call one sauce
exports.oneSauce=(req, res, next) =>{
    Sauce.findOne({
        _id:req.params.id
    }).then(
        (sauce) =>{
            res.status(200).json(sauce);
        }).catch(
            (error)=>{
                res.status(404).json({
                    error:error
                })
            }
        );
    
};
// call all sauces
exports.allSauces=(req, res, next) =>{
    Sauce.find().then(
        (sauces)=>{
            res.status(200).json(sauces);
        }
    ).catch(
        (error) =>{
            res.status(400).json({
                error:error
            });
        }
    );
};

exports.modifyASauce=(req, res, next) =>{
  //checks if the sauce userId is the same as current user  
    
    if(req.body.userId==req.token.userId){

    const sauceObject = req.file? // if the requests contains a file parses the body of the request
    {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    }:{...req.body};// if not sends it as an object

       Sauce.updateOne({
           _id: req.params.id
       }, {...sauceObject, _id:req.params.id})//passes either one whether it contains a file or not
       .then(()=> res.status(200).json({ message: "Object modified !"}))
       .catch(
        (error) =>{
            res.status(400).json({
                error:error
            });
        }
    );

}else{
    res.status(401).json({message:"unauthorized request"})
}
    
}

exports.deleteASauce=(req, res, next) =>{
    //checks if the sauce userId is the same as current user  
  
    
    Sauce.findOne({_id:req.params.id})
    .then((sauce)=>{
        if(sauce.userId==req.token.userId){
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink("images/"+ filename,()=>{
            Sauce.deleteOne({_id: req.params.id})
            .then(() => res.status(200).json({ message: 'objet deleted'}))
            .catch(
                (error) =>{
                    res.status(400).json({
                        error:error
                    });
                });
        })
    }else{
        res.status(401).json({message:"unauthorized request"})
    }})
    .catch(
        (error) =>{
            res.status(400).json({
                error:error
            });
        }
    );
};


//allows to like, unlike a sauce
exports.likeASauce=(req, res, next) =>{
    const thisUser= req.body.userId
  Sauce.findOne({_id: req.params.id}).then((sauce)=>{
      
     if (req.body.like==1){
        
        sauce.usersLiked.push(thisUser)
        sauce.likes++
        sauce.save()
        
     }else if(req.body.like==0){
         //if the userID is in the usersliked array removes it from that array, and likes--
            if(sauce.usersLiked.includes(thisUser)){
            let index= sauce.usersLiked.indexOf(thisUser)
            sauce.usersLiked.splice(index,1) 
            sauce.likes--
            sauce.save()
        //if the userID is in the usersDisliked removes it from that array, and dislikes--
            }else if (sauce.usersDisliked.includes(thisUser)){
                let index=sauce.usersDisliked.indexOf(thisUser)
                sauce.usersDisliked.splice(index,1)
                sauce.dislikes--
                sauce.save()
            } 
     }else if(req.body.like ==-1){
        sauce.usersDisliked.push(thisUser)
        sauce.dislikes++
        sauce.save()
     }
  }).then(()=> res.status(200).json({ message: "rating was successful!"}))
  .catch(
    (error) =>{
        res.status(400).json({
            error:error
        });
    }
);
    
};
