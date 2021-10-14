const Sauce = require("../models/sauce");
const fs = require('fs');

const jwt = require('jsonwebtoken');



exports.createSauce= (req, res, next) =>{
    
req.body.sauce=JSON.parse(req.body.sauce)

  const sauce = new Sauce({
   ...req.body.sauce,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
  });
 
  sauce.save().then(
    () => 
      res.status(201).json({
        message: 'Sauce saved successfully!'
      })
    
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
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId;
    if(req.body.userId==userId){

const sauceObject = req.file? 
    {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    }:{...req.body};

       Sauce.updateOne({
           _id: req.params.id
       }, {...sauceObject, _id:req.params.id})
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
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId;
    
    Sauce.findOne({_id:req.params.id})
    .then((sauce)=>{
        if(sauce.userId==userId){
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
