import express from 'express';
import {
  getPreparedItems,
  addPreparedItem,
  updatePreparedItem,
  deletePreparedItem,
  getGroceriesMaster,
  getItemAvailability,
  getItemCategories
} from '../controller/preparedItemController.js';

const router = express.Router();


// Prepared items CRUD (groceries_used is a string, prepared_date supported)
router.get('/prepared-items', getPreparedItems);
router.post('/prepared-items', addPreparedItem);
router.put('/prepared-items/:id', updatePreparedItem);
router.delete('/prepared-items/:id', deletePreparedItem);


// Groceries master for dropdown
router.get('/groceries-master', getGroceriesMaster);

// Item categories
router.get('/item-categories', getItemCategories);

// Item availability by item_no
router.get('/item-availability/:item_no', getItemAvailability);

export default router;
