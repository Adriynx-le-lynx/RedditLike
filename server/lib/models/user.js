import mongoose from "mongoose";
import bcrypt from "bcrypt";
import {from_json, to_json} from "../tools/tools.js";

const user_schema = mongoose.Schema({
    email: {type: String, required: true},
    password: {type: String, required: true},
    username: {type: String, required: true},
    admin: {type: Boolean, default: false},
    posts: [
        {type: mongoose.Types.ObjectId, ref: "Post"}
    ]
});

user_schema.pre('save', function(next) {
    const self = this;

    if (!this.isModified('password')) return next();

    bcrypt.genSalt(10, function(err, salt) {
        if (err) return next(err);

        bcrypt.hash(self.password, salt, function(err, hash) {
            if (err) return next(err);

            self.password = hash;
            next();
        });
    });
});

user_schema.methods.compare_password = function(password, cb) {
    bcrypt.compare(password, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

user_schema.methods.from_json = from_json;

user_schema.methods.to_json = to_json;

export default mongoose.model('User', user_schema);
