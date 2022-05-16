const mongoose = require('mongoose');

const KEGGSchema = new mongoose.Schema({

    'gene': {type:String},
    'pathway':{type:String}, 
    'description': {type:String},
    
});

const resultsdb = mongoose.connection.useDb("wheatblast")
const KEGGAestivums = resultsdb.model('kegg_aestivums', KEGGSchema)
const KEGGTurgidums = resultsdb.model('kegg_turgidums', KEGGSchema)
const KEGGTindicas = resultsdb.model('kegg_tindicas', KEGGSchema)

module.exports ={
    'aestivum':KEGGAestivums,
    'turgidum':KEGGTurgidums,
    'tindica':KEGGTindicas,
}