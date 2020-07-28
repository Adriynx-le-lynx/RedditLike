import mongoose from "mongoose";

class Mongo {
    constructor(db_name = "my_database") {
        this.db_name = db_name;
    }

    start_server(cb = () => {}) {
        try {
            mongoose.connect(`mongodb://localhost/${this.db_name}`, {useNewUrlParser: true});
            // Connection URL
            const db = mongoose.connection;
            db.on('error', console.error.bind(console, 'connection error:'));
            db.once('open', function() {
                // we're connected!
                console.log("Connected to the database")
                cb();
            });
        } catch (e) {
            console.log({error: e});
        }
    }
}

export default Mongo;