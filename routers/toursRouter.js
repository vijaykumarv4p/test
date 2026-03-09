const express = require('express');
const {
  deleteTour,
  getTour,
  updateTour,
  patchTour,
  createTour,
  getAllTours,
  validateId,
  checkTourBody,
} = require('../controller/toursController');
const router = express.Router();

router.param('id', validateId);
router.route('/').get(getAllTours).post(checkTourBody, createTour);
router
  .route('/:id')
  .get(getTour)
  .put(updateTour)
  .patch(patchTour)
  .delete(deleteTour);

module.exports = router;
