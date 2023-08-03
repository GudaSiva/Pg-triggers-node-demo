const express = require("express");
const { Pool } = require("pg");
require("dotenv").config();
const app = express();
const port = process.env.PORT;

// PostgreSQL database connection configuration
const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

app.use(express.json());

// Get all tasks
app.get("/tasks", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM tasks WHERE deleted_at IS NULL"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create a new task
app.post("/tasks", async (req, res) => {
  const { description } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO tasks (description) VALUES ($1) RETURNING *",
      [description]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete a task by ID
app.delete("/tasks/:id", async (req, res) => {
  const taskId = req.params.id;
  try {
    const result = await pool.query(
      "DELETE FROM tasks WHERE id = $1 RETURNING *",
      [taskId]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ error: "Task not found" });
    } else {
      res.json(result.rows[0]);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
