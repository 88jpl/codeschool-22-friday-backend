
// Start mongoose and connect
const { application } = require("express");
const mongoose = require("mongoose");
const db = mongoose.connection;

async function connect(user, pass, host, port, db_name) {
    let connectString = `mongodb://${user}:${pass}@${host}:${port}/${db_name}`;
    try {
        await mongoose.connect(connectString, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    } catch (err) {
        console.log("error connecting to mongoose", err);
        throw "mongo couldn't connect";
    }
}

//connect to mongoDB
const config = require("./config");

function onConnect(callback) {
    db.once("open ", () => {
        console.log("mongo connection open");
        callback();
    });
}

onConnect(() => {
    application.listen(config.http_port, () => {
        console.log(`serving on port ${config.http_port}`);
    });
});

try {
    connect(
        config.mongo_user,
        config.mongo_pass,
        config.mongo_host,
        config.mongo_port,
        config.mongo_db
    );
    console.log(`Started DB on port:${config.mongo_port}`)
} catch (err) {
    console.log(err);
    throw "couldn't start"
}