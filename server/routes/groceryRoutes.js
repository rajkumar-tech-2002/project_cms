import express from 'express';
import { getItems, addItem, updateItem, deleteItem, getCategories, getUnits } from '../controller/groceryController.js';

const router = express.Router();

// Get all items
router.get('/items', getItems);

// Get all categories
router.get('/categories', getCategories);

// Get all units
router.get('/units', getUnits);

// Add new item
router.post('/items', addItem);

// Edit item
router.put('/items/:id', updateItem);

// Delete item
router.delete('/items/:id', deleteItem);

export default router;
