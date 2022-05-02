const express = require('express');

const router = express.Router();

const Triticum = require("../models/wheatppi");

router.route("/total/").get(async (req, res,next)=>{

    const total = await Triticum.count();

    res.json(total)

});

router.route('/interactions/').get(async(req, res) => {

    let { database}= req.query

    let query ={}

    if (database != 'all'){
        query['database'] = database
    }

    

    let results = await Triticum.find({}).limit(500000).exec()
    let total = await Triticum.count();
    console.log(results)
    res.json({'total': total, 'results':results})

    
})

module.exports = router;