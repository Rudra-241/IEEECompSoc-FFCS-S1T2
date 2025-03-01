import express from 'express';
import { createClass } from '../controllers/classController.js';
import upload from '../config/multerConfig.js';
import { importStudents } from '../controllers/attendanceController.js';

const router = express.Router();

router.post('/api/classes', createClass);
router.post('/api/classes/:class_id/import', upload.single('csvFile'), importStudents);

export default router