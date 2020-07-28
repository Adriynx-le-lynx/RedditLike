import User from "../models/user.js";
import ObjectId from "mongodb";
import {add_user, decode} from "../tools/tools.js";

async function update_user(id, json) {
    const user = await User.findById(id);

    user.from_json(json);

    return user;
}

export default (app) => {
    app.get('/user', async (req, res) => {
        console.log('Get users');

        try {
            const db_users = await User.find({});
            const users = [];

            db_users.forEach((user) => {
                users.push(user.to_json());
            })

            return res.json({users: users});
        } catch (e) {
            return res.json(e);
        }
    });

    app.post('/user', async (req, res) => {
        console.log('Post users');

        try {
            const users = [];
            const body = req.body instanceof Array ? req.body : [req.body];

            for (const elem of body) {
                const user = await add_user(elem);

                if (user)
                    users.push(user.to_json());
                else
                    throw {name: "user_already_exist", message: "Email is already registered in the database"};
            }
            return res.json({users: users});
        } catch (e) {
            return res.json({error: e});
        }
    });

    app.get('/user/me', async (req, res) => {
        console.log('Get the logged user');
        const token = req.get("authorization").split(' ')[1];

        try {
            const decoded_token = decode(req);
            const user = await User.findById(decoded_token.id);

            return res.json({user: user.to_json()});
        } catch(e) {
            return res.status(403).json(e);
        }


        return res.send('Received a PUT HTTP method');
    });

    app.put('/user/:id', async (req, res) => {
        console.log(`put user: ${req.params.id}`);
        const id = req.params.id;

        try {
            const user = await update_user(id, req.body);

            return res.json({user: user.to_json()});
        } catch (e) {
            return res.json({error: e});
        }
    });

    app.patch('/user/:id', async (req, res) => {
        console.log(`patch user: ${req.params.id}`);
        const id = req.params.id;

        try {
            const user = await update_user(id, req.body);

            return res.json({user: user.to_json()});
        } catch (e) {
            return res.json({error: e});
        }
    });

    app.delete('/user/:id', async (req, res) => {
        console.log(`delete user: ${req.params.id}`);
        const id = req.params.id;

        try {
            const user = await User.findByIdAndDelete(id);

            return res.json({user: user.to_json()});
        } catch (e) {
            return res.json({error: e});
        }
    });
}
