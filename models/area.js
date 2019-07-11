var mongoose  = require('mongoose');
var Schema    = mongoose.Schema;

var AreaSchema = Schema({
    nativeId: Number,
    parentId: Schema.Types.ObjectId,
    code: { type: String, default:'00000000000'} ,
    name: String,
    shortName: String,
    groupName: String,
    phonics:  String,
    locale: { type: String, default:'all'} ,
    type: { type: String, enum: ['COUNTRY', 'PROVINCE', 'CITY', 'DISTRICT', 'TOWN']},
    valid: { type: Boolean, default: true},
    display: { type: Boolean, default: true},
    rank: Number,
    subURL: String
},{ timestamps: true, collection: 'common_region' });

mongoose.model('Area', AreaSchema);
