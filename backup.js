// app.get('/', (req, res) => {
//   console.log('Received a request');
//   res.status(201).json({ message: 'Hello World!', url: req.url });
// });
// app.get('/api/v1/tours', (req, res) => {
//   console.log('Received a request for tours');
//   res
//     .status(200)
//     .json({ message: 'Success', data: { tours: tours, total: tours.length } });
// });

// app
//   .route('/api/v1/tours')
//   .get((req, res) => {
//     console.log('Received a request for tours');
//     res.status(200).json({
//       message: 'Success',
//       data: { tours: tours, total: tours.length },
//     });
//   })
//   .post((req, res) => {
//     console.log('Received a POST request to create a tour');
//     let newId = tours[tours.length - 1].id + 1;
//     let newTour = Object.assign({ id: newId }, req.body);
//     console.log('New tour data:', newTour);
//     tours.push(newTour);
//     fs.writeFile(
//       './dev-data/data/tours-simple.json',
//       JSON.stringify(tours),
//       (err) => {
//         if (err) {
//           res.status(500).json({ message: 'Error creating tour!' });
//         } else {
//           res.status(201).json({
//             message: 'Tour created successfully!',
//             data: { tour: newTour },
//           });
//         }
//       },
//     );
//   });
// app
// .post('/api/v1/tours', (req, res) => {
//   console.log('Received a POST request to create a tour');
//   let newId = tours[tours.length - 1].id + 1;
//   let newTour = Object.assign({ id: newId }, req.body);
//   console.log('New tour data:', newTour);
//   tours.push(newTour);
//   fs.writeFile(
//     './dev-data/data/tours-simple.json',
//     JSON.stringify(tours),
//     (err) => {
//       if (err) {
//         res.status(500).json({ message: 'Error creating tour!' });
//       } else {
//         res.status(201).json({
//           message: 'Tour created successfully!',
//           data: { tour: newTour },
//         });
//       }
//     },
//   );
// });

// app
//   .route('/api/v1/tours/:id')
//   .get((req, res) => {
//     console.log(`Received a request for tour with ID: ${req.params.id}`);
//     const id = parseInt(req.params.id);
//     const tour = tours.find((tour) => tour.id === id);

//     if (tour) {
//       res.status(200).json({
//         message: 'Success',
//         data: { tour, meta: { type: 'all route ' } },
//       });
//     } else {
//       res.status(404).json({ message: 'Tour not found!', data: {} });
//     }
//   })
//   .put((req, res) => {
//     console.log(`Received a PUT request for tour with ID: ${req.params.id}`);
//     const id = parseInt(req.params.id);
//     const tourIndex = tours.findIndex((tour) => tour.id === id);
//     if (tourIndex !== -1) {
//       const updatedTour = { ...tours[tourIndex], ...req.body };
//       tours[tourIndex] = updatedTour;
//       fs.writeFile(
//         './dev-data/data/tours-simple.json',
//         JSON.stringify(tours),
//         (err) => {
//           if (err) {
//             res.status(500).json({ message: 'Error updating tour!' });
//           } else {
//             res.status(200).json({
//               message: 'Tour updated successfully!',
//               data: { tour: updatedTour },
//             });
//           }
//         },
//       );
//     } else {
//       res.status(404).json({ message: 'Tour not found!', data: {} });
//     }
//   })
//   .patch((req, res) => {
//     console.log(`Received a PATCH request for tour with ID: ${req.params.id}`);
//     const id = parseInt(req.params.id);
//     const tourIndex = tours.findIndex((tour) => tour.id === id);
//     console.log;
//     if (tourIndex !== -1) {
//       let seletedTour = tours[tourIndex];
//       let name = req.body.name;
//       console.log(name);
//       let regPrice = req.body.regPrice;
//       const updatedTour = { ...seletedTour, name, regPrice };
//       tours[tourIndex] = updatedTour;
//       fs.writeFile(
//         './dev-data/data/tours-simple.json',
//         JSON.stringify(tours),
//         (err) => {
//           if (err) {
//             res.status(500).json({ message: 'Error updating tour!' });
//           } else {
//             res.status(200).json({
//               message: 'Tour updated successfully!',
//               data: { tour: updatedTour, newName: name },
//             });
//           }
//         },
//       );
//     } else {
//       res.status(404).json({ message: 'Tour not found!', data: {} });
//     }
//   })
//   .delete((req, res) => {
//     console.log(`Received a DELETE request for tour with ID: ${req.params.id}`);
//     const id = parseInt(req.params.id);
//     const tourIndex = tours.findIndex((tour) => tour.id === id);
//     if (tourIndex !== -1) {
//       tours.splice(tourIndex, 1);
//       fs.writeFile(
//         './dev-data/data/tours-simple.json',
//         JSON.stringify(tours),
//         (err) => {
//           if (err) {
//             res.status(500).json({ message: 'Error deleting tour!' });
//           } else {
//             res
//               .status(204)
//               .json({ message: 'Tour deleted successfully!', data: {} });
//           }
//         },
//       );
//     } else {
//       res.status(404).json({ message: 'Tour not found!', data: {} });
//     }
//   });
// app.get('/api/v1/tours/:id', (req, res) => {
//   console.log(`Received a request for tour with ID: ${req.params.id}`);
//   const id = parseInt(req.params.id);
//   const tour = tours.find((tour) => tour.id === id);

//   if (tour) {
//     res.status(200).json({ message: 'Success', data: { tour } });
//   } else {
//     res.status(404).json({ message: 'Tour not found!', data: {} });
//   }
// });
// full update
// app.put('/api/v1/tours/:id', (req, res) => {
//   console.log(`Received a PUT request for tour with ID: ${req.params.id}`);
//   const id = parseInt(req.params.id);
//   const tourIndex = tours.findIndex((tour) => tour.id === id);
//   if (tourIndex !== -1) {
//     const updatedTour = { ...tours[tourIndex], ...req.body };
//     tours[tourIndex] = updatedTour;
//     fs.writeFile(
//       './dev-data/data/tours-simple.json',
//       JSON.stringify(tours),
//       (err) => {
//         if (err) {
//           res.status(500).json({ message: 'Error updating tour!' });
//         } else {
//           res.status(200).json({
//             message: 'Tour updated successfully!',
//             data: { tour: updatedTour },
//           });
//         }
//       },
//     );
//   } else {
//     res.status(404).json({ message: 'Tour not found!', data: {} });
//   }
// });
// partial update
// app.patch('/api/v1/tours/:id', (req, res) => {
//   console.log(`Received a PATCH request for tour with ID: ${req.params.id}`);
//   const id = parseInt(req.params.id);
//   const tourIndex = tours.findIndex((tour) => tour.id === id);
//   if (tourIndex !== -1) {
//     let seletedTour = tours[tourIndex];
//     let name = req.body.name;
//     let regPrice = req.body.regPrice;
//     const updatedTour = Object.assign({ name, regPrice }, seletedTour);
//     tours[tourIndex] = updatedTour;
//     fs.writeFile(
//       './dev-data/data/tours-simple.json',
//       JSON.stringify(tours),
//       (err) => {
//         if (err) {
//           res.status(500).json({ message: 'Error updating tour!' });
//         } else {
//           res.status(200).json({
//             message: 'Tour updated successfully!',
//             data: { tour: updatedTour },
//           });
//         }
//       },
//     );
//   } else {
//     res.status(404).json({ message: 'Tour not found!', data: {} });
//   }
// });
// app.delete('/api/v1/tours/:id', (req, res) => {
//   console.log(`Received a DELETE request for tour with ID: ${req.params.id}`);
//   const id = parseInt(req.params.id);
//   const tourIndex = tours.findIndex((tour) => tour.id === id);
//   if (tourIndex !== -1) {
//     tours.splice(tourIndex, 1);
//     fs.writeFile(
//       './dev-data/data/tours-simple.json',
//       JSON.stringify(tours),
//       (err) => {
//         if (err) {
//           res.status(500).json({ message: 'Error deleting tour!' });
//         } else {
//           res
//             .status(204)
//             .json({ message: 'Tour deleted successfully!', data: {} });
//         }
//       },
//     );
//   } else {
//     res.status(404).json({ message: 'Tour not found!', data: {} });
//   }
// });
