const fs = require('fs');
const toursFile = './dev-data/data/tours-simple.json';
const tours = JSON.parse(fs.readFileSync(toursFile));

exports.validateId = (req, res, next, idValue) => {
  const id = Number(req.params.id);
  const tour = tours.find((tour) => tour.id === id);
  if (!tour) {
    return res.status(404).json({ message: 'Invalid tour id !', data: {} });
  }
  console.log(' tour id ', idValue);
  next();
};
exports.getAllTours = (req, res) => {
  res.status(200).json({
    message: 'Success',
    data: { tours: tours, total: tours.length },
  });
};
exports.createTour = (req, res) => {
  let newId = tours[tours.length - 1].id + 1;
  let newTour = Object.assign({ id: newId }, req.body);
  console.log('New tour data:', newTour);
  tours.push(newTour);
  fs.writeFile(
    './dev-data/data/tours-simple.json',
    JSON.stringify(tours),
    (err) => {
      if (err) {
        res.status(500).json({ message: 'Error creating tour!' });
      } else {
        res.status(201).json({
          message: 'Tour created successfully!',
          data: { tour: newTour },
        });
      }
    },
  );
};
exports.getTour = (req, res) => {
  console.log(`Received a request for tour with ID: ${req.params.id}`);
  const id = Number(req.params.id);
  const tour = tours.find((tour) => tour.id === id);
  res.status(200).json({
    message: 'Success',
    data: { tour, meta: { type: 'all route ' } },
  });
};
exports.updateTour = (req, res) => {
  console.log(`Received a PUT request for tour with ID: ${req.params.id}`);
  const id = Number(req.params.id);
  const tourIndex = tours.findIndex((tour) => tour.id === id);
  const updatedTour = { ...tours[tourIndex], ...req.body };
  tours[tourIndex] = updatedTour;
  fs.writeFile(
    './dev-data/data/tours-simple.json',
    JSON.stringify(tours),
    (err) => {
      if (err) {
        res.status(500).json({ message: 'Error updating tour!' });
      } else {
        res.status(200).json({
          message: 'Tour updated successfully!',
          data: { tour: updatedTour },
        });
      }
    },
  );
};
exports.patchTour = (req, res) => {
  console.log(`Received a PATCH request for tour with ID: ${req.params.id}`);
  const id = Number(req.params.id);
  const tourIndex = tours.findIndex((tour) => tour.id === id);

  let selectedTour = tours[tourIndex];
  let name = req.body.name;
  console.log(name);
  let regPrice = req.body.regPrice;
  const updatedTour = { ...selectedTour, name, regPrice };
  tours[tourIndex] = updatedTour;
  fs.writeFile(
    './dev-data/data/tours-simple.json',
    JSON.stringify(tours),
    (err) => {
      if (err) {
        res.status(500).json({ message: 'Error updating tour!' });
      } else {
        res.status(200).json({
          message: 'Tour updated successfully!',
          data: { tour: updatedTour, newName: name },
        });
      }
    },
  );
};

exports.deleteTour = (req, res) => {
  console.log(`Received a DELETE request for tour with ID: ${req.params.id}`);
  const id = Number(req.params.id);
  const tourIndex = tours.findIndex((tour) => tour.id === id);
  tours.splice(tourIndex, 1);
  fs.writeFile(
    './dev-data/data/tours-simple.json',
    JSON.stringify(tours),
    (err) => {
      if (err) {
        res.status(500).json({ message: 'Error deleting tour!' });
      } else {
        res
          .status(204)
          .json({ message: 'Tour deleted successfully!', data: {} });
      }
    },
  );
};
