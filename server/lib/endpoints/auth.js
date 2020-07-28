import User from "../models/user.js";
import jwt from "jsonwebtoken";
import {add_user} from "../tools/tools.js";

export default (app) => {
    app.post('/auth/login', async (req, res) => {
        console.log('log an user')
        const email = req.body.email;
        const password = req.body.password;

        try {
            const user = await User.findOne({email: email});

            if (!user)
                throw {name: "user_not_found", message: "Email does not match"};

            user.compare_password(password, function(err, isMatch) {
                if (err) throw err;

                if (!isMatch) {
                    res.status(401).json({name: "wrong_password", message: "Password does not match"})
                    return;
                }

                const token = jwt.sign({ admin: user.admin, id: user.id }, process.env.SECRET);

                return res.json({user: user.to_json(), token: token});
            });
        } catch (e) {
            if (e.name)
                return res.status(400).json(e)
            return res.status(500).json(e);
        }
    });

    app.post('/auth/register', async (req, res) => {
        try {
            const user = await add_user(req.body);

            if (!user)
                throw {name: "user_already_exist", message: "User with the same email already exist"}

            return  res.json(user.to_json());
        } catch (e) {
            if (e.name)
                return res.status(409).json(e);
            return  res.status(500).json(e);
        }
    });
}
