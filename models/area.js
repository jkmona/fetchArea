var mongoose  = require('mongoose');
var Schema    = mongoose.Schema;

var AreaSchema = Schema({
    nativeId: { type: Number, require: true},
    parentId: { type: Schema.Types.ObjectId, require: true},
    code: { type: String, default:'00000000000', require: true} ,
    name: { type: String, require: true},
    shortName: String,
    groupName: String,
    phonics:  String,
    locale: { type: String, default:'all'} ,
    type: { type: String, require: true, enum: ['COUNTRY', 'PROVINCE', 'CITY', 'DISTRICT', 'TOWN']},
    valid: { type: Boolean, default: true},
    display: { type: Boolean, default: true},
    rank: { type: Number, require: true},
    subURL: String
},{ timestamps: true, collection: 'common_region' });

mongoose.model('Area', AreaSchema);
