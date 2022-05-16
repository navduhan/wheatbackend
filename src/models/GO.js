const mongoose = require('mongoose');

const GOSchema = new mongoose.Schema({

    'gene': {type:String},
    'term':{type:String}, 
    'description': {type:String},
    'definition': {type:String},
    'evidence':{type:String}, 
    'ontology':{type:String},
    
});



const resultsdb = mongoose.connection.useDb("wheatblast")
const GOAestivums = resultsdb.model('go_aestivums', GOSchema)
const GOTurgidums = resultsdb.model('go_turgidums', GOSchema)
const GOTindicas = resultsdb.model('go_tindicas', GOSchema)

module.exports ={
    'aestivum':GOAestivums,
    'turgidum':GOTurgidums,
    'tindica':GOTindicas,
}



