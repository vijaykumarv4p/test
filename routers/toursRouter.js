// const express = require('express');
// const {
//   deleteTour,
//   getTour,
//   updateTour,
//   patchTour,
//   createTour,
//   getAllTours,
//   checkTourBody,
// } = require('../controller/toursController');
// const router = express.Router();

// // router.param('id', validateId);
// router.route('/').get(getAllTours).post(checkTourBody, createTour);
// router
//   .route('/:id')
//   .get(getTour)
//   .put(updateTour)
//   .patch(patchTour)
//   .delete(deleteTour);

// module.exports = router;
const express = require('express');
const tourController = require('./../controller/toursController');
const { isAuthenticated } = require('../controller/authenticateController');
const router = express.Router();

// router.param('id', tourController.checkID);

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

// router.route('/tour-stats').get(tourController.getTourStats);
// router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router
  .route('/')
  .get(isAuthenticated, tourController.getAllTours)
  .post(isAuthenticated, tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
