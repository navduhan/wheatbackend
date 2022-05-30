const express = require('express');
const router = express.Router();
const getPPI = require("../introlog/introlog");
const GO = require("../models/GO");
const KEGG = require("../models/KEGG");
const Interpro = require("../models/Interpro"); 
const Local = require("../models/Local");
const TF = require("../models/TF");
const Effector =require("../models/Effector");
const mongoose = require('mongoose');

const wheatSchema = new mongoose.Schema({
    Host_Protein: {type:String},
    Pathogen_Protein: {type:String},
    ProteinA: {type:String},
    ProteinB: {type:String},
    intdb_x: {type:String},
    Method: {type:String},
    Type: {type:String},
    Confidence: {type:String},
    PMID: {type:String},
});

router.route('/ppi').post(async(req, res) => {


  const body = JSON.parse(JSON.stringify(req.body));
  console.log(body);

//  let results = 'kbunt1653501842990results'

let results = await getPPI(body.category,body.hspecies, body.pspecies, body.hi, body.hc, body.he,body.pi,body.pc,body.pe, body.intdb, body.genes, body.ids)
 res.json(results)
console.log(results)
 
      });

router.route('/results/').get(async(req,res) =>{
    let {results,page,  size} = req.query
    if(!page){
        page = 1
      }
     if (page){
       page = parseInt(page) + 1
     }
      if (!size){
        size = 1000
      }

      const limit = parseInt(size)

      const skip = (page-1) * size;
      const resultsdb = mongoose.connection.useDb("kbunt_results")
      const Results = resultsdb.model(results, wheatSchema)

      let final = await Results.find({}).limit(limit).skip(skip).exec()
      let counts = await Results.count()
      let host_protein =await Results.distinct("Host_Protein")
     
      let pathogen_protein =await Results.distinct('Pathogen_Protein')
      res.json({'results':final,'total':counts,'hostcount':host_protein.length,'pathogencount':pathogen_protein.length})

})

router.route('/network/').get(async(req,res) =>{
  let {results,page,  size} = req.query
  // if(!page){
  //     page = 1
  //   }
  //  if (page){
  //    page = parseInt(page) + 1
  //  }
  //   if (!size){
  //     size = 1000
  //   }

  //   const limit = parseInt(size)

  //   const skip = (page-1) * size;
    const resultsdb = mongoose.connection.useDb("kbunt_results")
    const Results = resultsdb.model(results, wheatSchema)

    let final = await Results.find().exec()
    let counts = await Results.count()
    let host_protein =await Results.distinct("Host_Protein")
   
    let pathogen_protein =await Results.distinct('Pathogen_Protein')
    res.json({'results':final,'total':counts,'hostcount':host_protein.length,'pathogencount':pathogen_protein.length})

})



router.route('/go/').get(async(req, res) => {

 

  let {species, page, size} = req.query
    if(!page){
        page = 1
      }
     if (page){
       page = parseInt(page) + 1
     }
      if (!size){
        size = 10
      }

      const limit = parseInt(size)

      const skip = (page-1) * size;

      let go_results = await GO[species].find().limit(limit).skip(skip).exec()
      let total = await GO[species].count()
      let knum = await GO[species].distinct('term')
      console.log(knum.length)
      res.json({'data':go_results, 'total':total})

})


router.route('/kegg/').get(async(req, res) => {

 

  let {species, page, size} = req.query
    if(!page){
        page = 1
      }
     if (page){
       page = parseInt(page) + 1
     }
      if (!size){
        size = 10
      }

      const limit = parseInt(size)

      const skip = (page-1) * size;

      let kegg_results = await KEGG[species].find().limit(limit).skip(skip).exec()
      let total = await KEGG[species].count()

      res.json({'data':kegg_results, 'total':total})

})



router.route('/interpro/').get(async(req, res) => {

  let {species, page, size} = req.query
    if(!page){
        page = 1
      }
     if (page){
       page = parseInt(page) + 1
     }
      if (!size){
        size = 10
      }

      const limit = parseInt(size)

      const skip = (page-1) * size;

      let interpro_results = await Interpro[species].find().limit(limit).skip(skip).exec()
      let total = await Interpro[species].count()

      res.json({'data':interpro_results, 'total':total})

})

router.route('/local/').get(async(req, res) => {

  let {species, page, size} = req.query
    if(!page){
        page = 1
      }
     if (page){
       page = parseInt(page) + 1
     }
      if (!size){
        size = 10
      }

      const limit = parseInt(size)

      const skip = (page-1) * size;

      let local_results = await Local[species].find().limit(limit).skip(skip).exec()
      let total = await Local[species].count()

      res.json({'data':local_results, 'total':total})

})

router.route('/tf/').get(async(req, res) => {

  let {species, page, size} = req.query
    if(!page){
        page = 1
      }
     if (page){
       page = parseInt(page) + 1
     }
      if (!size){
        size = 10
      }

      const limit = parseInt(size)

      const skip = (page-1) * size;

      let transcription_results = await TF[species].find().limit(limit).skip(skip).exec()
      let total = await TF[species].count()

      res.json({'data':transcription_results, 'total':total})

})

router.route('/effector/').get(async(req, res) => {

  let {species, page, size} = req.query
    if(!page){
        page = 1
      }
     if (page){
       page = parseInt(page) + 1
     }
      if (!size){
        size = 10
      }

      let query = {
        'type': species
      }

      const limit = parseInt(size)

      const skip = (page-1) * size;

      let effector_results = await Effector['tindica'].find(query).limit(limit).skip(skip).exec()
      let total = await Effector['tindica'].count(query)

      res.json({'data':effector_results, 'total':total})

})



module.exports = router;