import express from 'express';
import {
    loginUser,
    getRoles,
    getCounters,
    getAllUsers,
    createUser,
    updateUser,
    deleteUser
} from '../controller/userController.js';

const router = express.Router();

// Auth routes
router.post('/login', loginUser);
router.get('/roles', getRoles);
router.get('/counters', getCounters);

// User Management routes
router.get('/users', getAllUsers);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

export default router;
