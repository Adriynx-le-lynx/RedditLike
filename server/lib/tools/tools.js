import User from "../models/user.js";
import jwt from "jsonwebtoken";

export function from_json(json) {
    const keys = Object.keys(json);
    const self = this;

    keys.forEach(function(key) {
        self[key] = json[key];
    })

    self.save();
};

export function to_json() {
    const self = this.toJSON();

    self["id"]= this._id;
    delete self._id;
    delete self["__v"];

    return self;
};

export async function add_user(body) {
    if ((await User.find({email: body.email})).length > 0)
        return null;

    const user = new User(body);

    user.save();

    return user;
}

function get_token(req) {
    const split_auth_header = req.get('authorization').split(' ');

    return split_auth_header[split_auth_header.length - 1];
}

export function decode(req) {
    try {
        const token = get_token(req);
        const decoded = jwt.verify(token, process.env.SECRET);

        if (!decoded)
            return null;

        return decoded
    } catch (e) {
        throw e;
    }
}