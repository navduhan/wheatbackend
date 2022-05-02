const mongoose = require('mongoose');

const wheatSchema = new mongoose.Schema({
plant:{type: String},
pathogen:{type:String},
intdb:{type:String},
identity:{type:Number},
coverage:{type:Number},
evalue:{type:Number},
intype:{type:String}
});

module.exports = Triticum = mongoose.model('taestivum_interactions', wheatSchema)
