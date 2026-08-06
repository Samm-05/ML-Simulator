const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const expController = require('../controllers/experimentController');

// Experiment Management Routes
router.post('/save', authenticate, expController.saveExperiment);
router.get('/user/:algorithm', authenticate, expController.getUserExperiments);
router.get('/:id', authenticate, expController.getExperimentById);
router.delete('/:id', authenticate, expController.deleteExperiment);

module.exports = router;
