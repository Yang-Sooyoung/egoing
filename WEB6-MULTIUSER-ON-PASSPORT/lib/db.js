// Use JSON file for storage
const low = require("lowdb");
const FileSync = require("lowdb/adapters/Filesync");
const adapter = new FileSync("db.json");
const db = low(adapter);
db.defaults({users:[], topics:[]}).write();
module.exports = db;