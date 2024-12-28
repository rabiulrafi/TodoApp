const oracledb = require('oracledb');
const dbConfig = require('./db');

async function testConnection() {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig); 
    console.log("Connected to Oracle Database!"); 
    
  } catch (err) {
    console.error("Connection failed!", err);
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

testConnection();
