const mongoose = require('mongoose');

const LocalSchema = new mongoose.Schema({

    'gene': {type:String}, 
    'location': {type:String},
    
});

const resultsdb = mongoose.connection.useDb("wheatblast")
const LocalAestivums = resultsdb.model('local_aestivums', LocalSchema)
const LocalTurgidums = resultsdb.model('local_turgidums', LocalSchema)
const LocalTindicas = resultsdb.model('local_tindicas', LocalSchema)

module.exports ={
    'aestivum':LocalAestivums,
    'turgidum':LocalTurgidums,
    'tindica':LocalTindicas,
}