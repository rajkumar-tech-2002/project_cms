import express from 'express';
import {
	getAllPurchases,
	getPurchaseById,
	createPurchase,
	updatePurchase,
	deletePurchase,
	getVendorsForDropdown,
	getGroceriesForDropdown,
	movePurchaseToStock,
	createPurchaseBill,
	getBillsByPurchase,
	getBillDetails,
	getLogo
} from '../controller/purchaseController.js';

const router = express.Router();

// Purchase routes
router.get('/purchases', getAllPurchases);
router.get('/purchases/logo', getLogo);
router.get('/purchases/:id', getPurchaseById);
router.post('/purchases', createPurchase);
router.put('/purchases/:id', updatePurchase);
router.delete('/purchases/:id', deletePurchase);
// Move purchased items to grocery_master and stock IN
router.post('/purchases/move-to-stock', movePurchaseToStock);

// Billing routes
router.post('/purchases/bills', createPurchaseBill);
router.get('/purchases/:id/bills', getBillsByPurchase);
router.get('/purchases/bills/:id', getBillDetails);

// Dropdown data routes
router.get('/vendors/dropdown', getVendorsForDropdown);
router.get('/groceries/dropdown', getGroceriesForDropdown);


export default router;
