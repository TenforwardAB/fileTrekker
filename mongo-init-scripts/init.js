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

db.folders.createIndex({ _id: 1 });

db.folders.createIndex(
    { parent: 1, isGroupFolder: 1 },
    { partialFilterExpression: { isGroupFolder: true }, unique: true }
);
