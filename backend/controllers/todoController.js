const oracledb = require('oracledb');
const dbConfig = require('../config/db');

async function getTodos(req, res) {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute('SELECT * FROM TODO');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

async function addTodo(req, res) {
  const { title, description } = req.body;
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `INSERT INTO TODO (title, description) VALUES (:title, :description)`,
      [title, description],
      { autoCommit: true }
    );
    res.json({ success: true, id: result.lastRowid });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

async function getSingleTodo(req, res) {
    const { id } = req.params;
    let connection;
    try {
      connection = await oracledb.getConnection(dbConfig);
      const result = await connection.execute('SELECT * FROM TODO WHERE id = :id', [id]);
      if (result.rows.length === 0) {
        res.status(404).json({ error: 'Todo not found' });
      } else {
        res.json(result.rows[0]);
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    } finally {
      if (connection) {
        await connection.close();
      }
    }
  }
  async function deleteSingleTodo (req, res) {
    const { id } = req.params;
    let connection;
    try {
      connection = await oracledb.getConnection(dbConfig);
      const result = await connection.execute('DELETE FROM TODO WHERE id = :id', [id], { autoCommit: true });
      if (result.rowsAffected === 0) {
        res.status(404).json({ error: 'Todo not found' });
      } else {
        res.json({ success: true });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    } finally {
      if (connection) {
        await connection.close();
      }
    }
  }
  async function updateSingleTodo (req, res) {
    const { id } = req.params;
    const { title, description } = req.body;
    let connection;
    try {
      connection = await oracledb.getConnection(dbConfig);
      const result = await connection.execute(
        'UPDATE TODO SET title = :title, description = :description WHERE id = :id',
        [title, description, id],
        { autoCommit: true }
      );
      if (result.rowsAffected === 0) {
        res.status(404).json({ error: 'Todo not found' });
      } else {
        res.json({ success: true });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    } finally {
      if (connection) {
        await connection.close();
      }
    }
  }

module.exports = { getTodos, addTodo, getSingleTodo, deleteSingleTodo, updateSingleTodo };
