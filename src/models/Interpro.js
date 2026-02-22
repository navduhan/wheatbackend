const mongoose = require('mongoose');

const InterproSchema = new mongoose.Schema({

    'gene': {type:String},
    'length':{type:Number}, 
    'interpro_id': {type:String},
    'sourcedb': {type:String},
    'domain': {type:String},
    'domain_description': {type:String},
    'score': {type:Number},
    
    
});

const resultsdb = mongoose.connection.useDb("wheatbackend")
const InterproAestivums = resultsdb.model('interpro_aestivums', InterproSchema)
const InterproTurgidums = resultsdb.model('interpro_turgidums', InterproSchema)
const InterproTindicas = resultsdb.model('interpro_tindicas', InterproSchema)

module.exports ={
    'aestivum':InterproAestivums,
    'turgidum':InterproTurgidums,
    'tindica':InterproTindicas,
}