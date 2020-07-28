import 'dotenv/config.js';
import express from 'express';
import user_endpoints from "./endpoints/user.js";
import auth_endpoint from "./endpoints/auth.js";
import post_endpoints from "./endpoints/post.js";
import body_parser from "body-parser";
import cors from "cors";
import Mongo from "./db.js";

class Server {
    constructor() {
        this.app = express();
        this.app.use(cors());
        this.app.use(body_parser.json({limit: '50mb'}));
        this.app.use(body_parser.urlencoded({ extended: true }));
        this._create_endpoints();
    }

    _create_endpoints() {
        auth_endpoint(this.app);
        user_endpoints(this.app);
        post_endpoints(this.app);
    }

    start() {
        const cb = () => {
            this.app.listen(process.env.PORT, () => {
                    console.log(`Example app listening on port ${process.env.PORT}!`);
                }
            );
        };
        this.mongo = new Mongo("db");

        this.mongo.start_server(cb);
    }
}

export default Server;
