import express from 'express';
import { getInventory } from '../controller/inventoryController.js';

const router = express.Router();

router.get('/inventory', getInventory);

export default router;
