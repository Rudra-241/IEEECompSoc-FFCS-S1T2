import pool from '../config/database.js';

export const createClass = async (req, res) => {
  try {
    const { class_name } = req.body;
    const result = await pool.query(
      'INSERT INTO classes (class_name) VALUES ($1) RETURNING id',
      [class_name]
    );
    res.json({ message: 'Class created', class_id: result.rows[0].id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create class' });
  }
};


