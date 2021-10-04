const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const sauceCtrl = require('../controllers/sauce');

router.post("/",auth, multer,sauceCtrl.createSauce);
router.get("/:id", auth, sauceCtrl.oneSauce);
router.get("/" , auth, sauceCtrl.allSauces);
router.put("/:id", auth, multer, sauceCtrl.modifyASauce);
router.delete("/:id", auth, sauceCtrl.deleteASauce);

router.post("/:id/like", sauceCtrl.likeASauce);

module.exports = router;