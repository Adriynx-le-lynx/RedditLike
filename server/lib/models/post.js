import mongoose from "mongoose";
import {from_json, to_json} from "../tools/tools.js";

const post_schema = mongoose.Schema({
    user: {type: mongoose.Types.ObjectId, ref: "User"},
    title: {type: String, required: true},
    img: String,
    description: String,
    users_liked: [{type: mongoose.Types.ObjectId, ref: "User"}],
    comments: [String],
}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" }});

post_schema.methods.from_json = from_json;

post_schema.methods.to_json = to_json;

export default mongoose.model('Post', post_schema);
