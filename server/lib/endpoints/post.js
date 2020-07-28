import Post from "../models/post.js";
import {decode} from "../tools/tools.js";

async function update_post(id, json) {
    const post = await Post.findById(id);

    post.from_json(json);

    return post;
}

export default (app) => {
    app.get('/post', async (req, res) => {
        console.log('Get posts');

        try {
            const db_posts = await Post.find({});
            const posts = [];

            db_posts.forEach((post) => {
                posts.push(post.to_json());
            })

            return res.json({posts: posts});
        } catch (e) {
            return res.status(500).json({error: e});
        }
    });

    app.post('/post', async (req, res) => {
        console.log('Post posts');

        try {
            const posts = [];
            const body = req.body instanceof Array ? req.body : [req.body];
            const decoded_token = decode(req);

            console.log(body);

            for (const elem of body) {
                elem.user = decoded_token.id;

                const post = new Post(elem);

                if (post) {
                    posts.push(post.to_json());
                    post.save();
                }
            }
            return res.json({posts: posts});
        } catch (e) {
            console.log(e);
            return res.json({error: e});
        }
    });

    app.put('/post/:id', async (req, res) => {
        console.log(`put post: ${req.params.id}`);
        const id = req.params.id;

        try {
            const post = await update_post(id, req.body);

            return res.json({post: post.to_json()});
        } catch (e) {
            return res.json({error: e});
        }
    });

    app.post('/post/:id/comment', async (req, res) => {
        console.log(`add a comment: ${req.params.id}`);
        const id = req.params.id;

        try {
            const post = await Post.findById(id);

            console.log(post, req.body);

            if (!post)
                throw {name: "post_not_found", message: "Post not found"}

            post.comments.push(req.body.comment);

            post.save();

            return res.json({post: post.to_json()});
        } catch (e) {
            return res.json({error: e});
        }
    });

    app.get('/post/:id/like', async (req, res) => {
        console.log(`Like a post: ${req.params.id}`);
        const id = req.params.id;

        try {
            let saved_index;
            const decoded_token = decode(req);
            const post = await Post.findById(id);
            const user = post.users_liked.filter((user_id, index) => {
                saved_index = index;
                return user_id.toString() === decoded_token.id
            });

            if (user.length > 0)
                post.users_liked.splice(saved_index, 1);
            else
                post.users_liked.push(decoded_token.id);

            post.save();

            return res.json({post: post.to_json()});
        } catch (e) {
            return res.json({error: e});
        }
    });

    app.patch('/post/:id', async (req, res) => {
        console.log(`patch post: ${req.params.id}`);
        const id = req.params.id;

        try {
            const post = await update_post(id, req.body);

            return res.json({post: post.to_json()});
        } catch (e) {
            return res.json({error: e});
        }
    });

    app.delete('/post/:id', async (req, res) => {
        console.log(`delete post: ${req.params.id}`);
        const id = req.params.id;

        try {
            const post = await Post.findByIdAndDelete(id);

            return res.json({post: post.to_json()});
        } catch (e) {
            return res.json({error: e});
        }
    });
}
