import express from 'express';
import { markAttendance, getPresentStudents, getAbsentStudents } from '../controllers/attendanceController.js';

const router = express.Router();

router.post('/api/classes/:class_id/attendance', markAttendance);
router.get('/api/classes/:class_id/present', getPresentStudents);
router.get('/api/classes/:class_id/absent', getAbsentStudents);


export default router