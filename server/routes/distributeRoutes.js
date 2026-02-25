import express from 'express';
import {
  getDistributedItems,
  addDistributedItem,
  updateDistributedItem,
  deleteDistributedItem,
  getAllLocations,
  getAllPreparedItems,
  getNotifications,
  clearNotifications
} from '../controller/distributeController.js';

const router = express.Router();

// Distributed items CRUD
router.get('/distributed-items', getDistributedItems);
router.get('/distribution-notifications', getNotifications);
router.post('/distribution-clear-notifications', clearNotifications);
router.post('/distributed-items', addDistributedItem);
router.put('/distributed-items/:id', updateDistributedItem);
router.delete('/distributed-items/:id', deleteDistributedItem);

// Dropdowns
router.get('/distribution-locations', getAllLocations);
router.get('/distribution-prepared-items', getAllPreparedItems);

export default router;
