import express from 'express';
import {
    recordSale,
    getCounterMonitoringData,
    getCounterStock,
    syncCounterStock,
    getCounterSalesReport,
    getCounterReportSummary,
    getAdminSalesNotifications,
    clearAdminNotifications
} from '../controller/salesController.js';

const router = express.Router();

router.post('/sales', recordSale);
router.get('/sales/monitor', getCounterMonitoringData);
router.get('/sales/admin-notifications', getAdminSalesNotifications);
router.post('/sales/clear-notifications', clearAdminNotifications);
router.get('/sales/stock/:counter', getCounterStock);
router.get('/sales/sync', syncCounterStock);
router.get('/sales/report', getCounterSalesReport);
router.get('/sales/report-summary', getCounterReportSummary);

export default router;
