const Sauce = require("../models/sauce");
const fs = require('fs');


exports.createSauce= (req, res, next) =>{
    
req.body.sauce=JSON.parse(req.body.sauce)

  const sauce = new Sauce({
   ...req.body.sauce,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
  });
  console.log(req.body.sauce);
  
  sauce.save().then(
    () => 
      res.status(201).json({
        message: 'Sauce saved successfully!'
      })
    
  ).catch(
    (error) => {
      res.status(400).json({
        error: error,
        message :'something went wrong with the sauce creation'

      });
    }
  );
};

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

    
}

exports.deleteASauce=(req, res, next) =>{
    
    Sauce.findOne({_id:req.params.id})
    .then((sauce)=>{
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
    })
    .catch(
        (error) =>{
            res.status(400).json({
                error:error
            });
        }
    );
};

exports.likeASauce=(req, res, next) =>{
    const thisUser= req.body.userId
  Sauce.findOne({_id: req.params.id}).then((sauce)=>{
      
     if (req.body.like==1){
        
        sauce.usersLiked.push(thisUser)
        sauce.likes++
        sauce.save()
        
     }else if(req.body.like==0){
        if(sauce.usersLiked.includes(thisUser)){
           let index= sauce.usersLiked.indexOf(thisUser)
          sauce.usersLiked.splice(index,1) 
          sauce.likes--
          sauce.save()
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
