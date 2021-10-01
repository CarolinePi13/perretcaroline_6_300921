const express = require('express');
const router = express.Router();

const sauceCtrl = require('../controllers/sauce');

router.post("/sauces", sauceCtrl.createSauce);
router.get("/sauces/:id", sauceCtrl.oneSauce);
router.get("/sauces" , sauceCtrl.allSauces);
router.put("/sauces/:id", sauceCtrl.modifyASauce);
router.delete("/sauces/:id" , sauceCtrl.deleteASauce);

router.post("sauces/:id/like", sauceCtrl.likeASauce);

module.exports = router;