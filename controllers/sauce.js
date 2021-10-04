const Sauce = require("../models/sauce");
const fs = require('fs');
const { Console } = require("console");

const ObjectID = require("mongoose").Types.ObjectId;

exports.createSauce= (req, res, next) =>{
const sauceObject = JSON.parse(req.body.sauce); 

  const sauce = new Sauce({
    ...sauceObject,
    
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
  });
  
  console.log(sauce);
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
        fs.unlink(`images/${filename}`,()=>{
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
    
    if (req.body.like==1){

    Sauce.findByIdAndUpdate(
        req.params.id
    , 
    {
        likes:1,
        $addToSet:{ usersLiked:req.body.userId}

    },
    {new:true},
    
    )
    .then(()=> res.status(200).json({ message: "like added!"})) 
}else if(req.body.like==0){

    Sauce.findByIdAndUpdate(
        req.params.id
    , 
   
    {
        $pull:{usersLiked:req.body.userId,
       usersDisliked:req.body.userId }
    },
    {new:true},
    
    )
    .then(()=> res.status(200).json({ message: "like removed!"})) 

}else if (req.body.like==-1){
    Sauce.findByIdAndUpdate(
        req.params.id
    , 
   
    {   
        likes:-1,
        $addToSet:{usersDisliked:req.body.userId}

    },
    {new:true},
    
    )
    .then(()=> res.status(200).json({ message: "dilike added!"})) 
}
   
   
    
     
};
