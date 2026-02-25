import express from 'express';
import { getDashboardData, getCounterDashboardData } from '../controller/dashboardController.js';
import { getAdminReportData } from '../controller/reportController.js';

const router = express.Router();

router.get('/dashboard/stats', getDashboardData);
router.get('/dashboard/counter', getCounterDashboardData);
router.get('/reports/admin', getAdminReportData);

export default router;
