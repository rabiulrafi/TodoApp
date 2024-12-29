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


  async function updateCompleteTodo (req, res) {
    const { id } = req.params;
    const { title, description,IS_COMPLETED } = req.body;
    let connection;
    try {
      connection = await oracledb.getConnection(dbConfig);
      const result = await connection.execute(
        'UPDATE TODO SET title = :title, description = :description, is_completed= :IS_COMPLETED WHERE id = :id',
        [title, description,IS_COMPLETED, id],
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

  async function toggleTodoCompletion(req, res) {
    const { id } = req.params;
    const { IS_COMPLETED } = req.body;
  
    // Ensure `is_completed` is numeric (0 or 1)
    console.log(req.body);
    if (isNaN(id) || isNaN(IS_COMPLETED)) {
      return res.status(400).json({ error: 'Invalid input: ID and IS_COMPLETED must be numbers' });
    }
    const isCompleted = Number(IS_COMPLETED) === 1 ? 1 : 0;
    console.log(isCompleted);
  
    if (!id) {
      return res.status(400).json({ error: 'ID is required' });
    }
  
    let connection;
    try {
      connection = await oracledb.getConnection(dbConfig);
      const result = await connection.execute(
        'UPDATE TODO SET is_completed = :is_completed WHERE id = :id',
        { is_completed: isCompleted, id }, // Using named parameters for clarity
        { autoCommit: true }
      );
  
      if (result.rowsAffected === 0) {
        res.status(404).json({ error: 'Todo not found' });
      } else {
        res.json({ success: true });
      }
    } catch (err) {
      console.error('Database error:', err);
      res.status(500).json({ error: err.message });
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          console.error('Error closing connection:', err);
        }
      }
    }
  }


module.exports = { getTodos, addTodo, getSingleTodo, deleteSingleTodo, updateSingleTodo,updateCompleteTodo,toggleTodoCompletion };
