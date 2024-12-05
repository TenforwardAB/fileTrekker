db = db.getSiblingDB("subspace");
const user = process.env.APP_DB_USER;
const password = process.env.APP_DB_PASSWORD;
db.createUser({
    user: user,
    pwd: password,
    roles: [
        { role: "dbAdmin", db: "subspace" },
        { role: "readWrite", db: "subspace" }
    ]
});

db.folders.createIndex(
    { name: 1, parent: 1 },
    { unique: true }
);
