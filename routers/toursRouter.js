const express = require('express');
const {
  deleteTour,
  getTour,
  updateTour,
  patchTour,
  createTour,
  getAllTours,
  validateId,
} = require('../dev-data/controller/toursController');
const router = express.Router();

router.param('id', validateId);
router.route('/').get(getAllTours).post(createTour);
router
  .route('/:id')
  .get(getTour)
  .put(updateTour)
  .patch(patchTour)
  .delete(deleteTour);

module.exports = router;
