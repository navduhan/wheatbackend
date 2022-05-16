const mongoose = require('mongoose');

const TFSchema = new mongoose.Schema({

    'gene': {type:String}, 
    'tf_family': {type:String},
    
});

const resultsdb = mongoose.connection.useDb("wheatblast")
const TFAestivums = resultsdb.model('tf_aestivums', TFSchema)
const TFTurgidums = resultsdb.model('tf_turgidums', TFSchema)

module.exports ={
    'aestivum':TFAestivums,
    'turgidum':TFTurgidums,
   
}