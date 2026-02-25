import express from 'express';
import {
	getLocations,
	addLocation,
	updateLocation,
	deleteLocation
} from '../controller/locationController.js';

const router = express.Router();

// Get all locations
router.get('/locations', getLocations);
// Add a new location
router.post('/locations', addLocation);
// Update a location
router.put('/locations/:id', updateLocation);
// Delete a location
router.delete('/locations/:id', deleteLocation);

export default router;
