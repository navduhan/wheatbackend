const mongoose = require('mongoose');

const EffectorSchema = new mongoose.Schema({

    'gene': {type:String}, 
    'length': {type:Number},
    'description':{type:String},
    'type':{type:String},
    
});

const resultsdb = mongoose.connection.useDb("wheatblast")

const EffectorTindicas = resultsdb.model('effector_tindicas', EffectorSchema)

module.exports ={
    
    'tindica':EffectorTindicas,
}