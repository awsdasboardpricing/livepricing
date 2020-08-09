'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db,callback) {
  db.createTable("users", {
    id:{
      type: "int",
      primaryKey:true,
      autoIncrement: true
    },
    username:{
      type: "text",
      notNull: true
    },
    password:{
      type: "text",
      notNull: true
    },
    aws_account: {
      type: "text",
      notNull: true
    }
  }, function(err){
    if (err) return callback(err);
    return callback()
  });
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};
