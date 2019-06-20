import { Schema, model } from 'mongoose';

var AreaSchema = Schema({
    nativeId: String ,
    parentId: Schema.Types.ObjectId,
    nativeCode: { type: String, default:'86000000000'} ,
    name: String,
    shortName: String,
    groupName: String,
    pinyin:  String,
    level: Number,
    valid: { type: Boolean, default: true},
    display: { type: Boolean, default: true},
    order: Number,
    create_at: { type: Date, default: Date.now },
    update_at: { type: Date, default: Date.now }
});

model('Area', AreaSchema);
