const oracledb = require('oracledb');
require('dotenv').config();
const env = require('../config/env');

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

const dbConfig = {
  user: env.DB_USER,
  password: env.DB_PASSWORD,    
  connectString: `${env.DB_HOST}:${env.DB_PORT}/${env.DB_NAME}`,
};

module.exports = dbConfig;
