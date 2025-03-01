import { readFileSync, unlinkSync } from 'fs';
import { parse } from 'csv-parse';
import pool from '../config/database.js';

export const importStudents = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Please upload a CSV file' });
    }

    const { class_id } = req.params;
    const fileContent = readFileSync(req.file.path, 'utf-8');
    
    const records = [];
    const parser = parse(fileContent, { columns: true, skip_empty_lines: true });

    for await (const record of parser) {
      records.push(record);
    }

    let totalUsers = 0;
    for (const record of records) {
      const result = await pool.query(
        'INSERT INTO students (class_id, unique_number, name) VALUES ($1, $2, $3) ON CONFLICT (unique_number) DO NOTHING RETURNING id',
        [class_id, record.unique_number, record.name]
      );
      if (result.rows.length > 0) totalUsers++;
    }

    unlinkSync(req.file.path);
    
    res.json({ message: 'Users imported', total_users: totalUsers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to import users' });
  }
};

export const markAttendance = async (req, res) => {
  try {
    const { class_id } = req.params;
    const { unique_number } = req.body;

    const studentResult = await pool.query(
      'SELECT id FROM students WHERE class_id = $1 AND unique_number = $2',
      [class_id, unique_number]
    );

    if (studentResult.rows.length === 0) {
      return res.status(404).json({ message: 'User not found', unique_number });
    }

    await pool.query(
      `INSERT INTO attendance (class_id, student_id, date) 
       VALUES ($1, $2, CURRENT_DATE) 
       ON CONFLICT (class_id, student_id, date) DO NOTHING`,
      [class_id, studentResult.rows[0].id]
    );

    res.json({ message: 'Attendance updated', unique_number, status: 'Present' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to mark attendance' });
  }
};

export const getPresentStudents = async (req, res) => {
  try {
    const { class_id } = req.params;
    const result = await pool.query(
      `SELECT s.unique_number, s.name 
       FROM attendance a 
       JOIN students s ON a.student_id = s.id 
       WHERE a.class_id = $1 
       AND a.date = CURRENT_DATE`,
      [class_id]
    );
    res.json({ class_id: parseInt(class_id), date: new Date().toISOString().split('T')[0], present_students: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch present students' });
  }
};
