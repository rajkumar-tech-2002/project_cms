import express from 'express';
import { getVendors, addVendor, updateVendor, deleteVendor } from '../controller/vendorController.js';

const router = express.Router();

router.get('/vendors', getVendors);
router.post('/vendors', addVendor);
router.put('/vendors/:id', updateVendor);
router.delete('/vendors/:id', deleteVendor);

export default router;
