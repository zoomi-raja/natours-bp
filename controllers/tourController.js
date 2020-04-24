const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures');
// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );
// exports.checkID = (req, res, next, val) => {
//   console.log(val);
//   if (req.params.id * 1 > tours.length) {
//     return res.status(404).send({ status: 'fail', message: 'invalid id' });
//   }
//   next();
// };
exports.allowedBody = (req, res, next) => {
  const allowedParams = [
    'name',
    'duration',
    'maxGroupSize',
    'difficulty',
    'ratingsAverage',
    'ratingsQuantity',
    'price',
    'priceDiscount',
    'summary',
    'description',
    'imageCover',
    'images',
    'createdAt',
    'startDates',
  ];
  const reqBody = Object.keys(req.body);
  const isValidRequest = reqBody.every((field) => {
    return allowedParams.includes(field);
  });
  if (!isValidRequest) {
    return res
      .status(400)
      .send({ status: 'fail', message: 'invalid request body' });
  }
  next();
};
exports.aliasTopCheapTours = (req, res, next) => {
  req.query.limit = 5;
  req.query.sort = 'price';
  next();
};
exports.getAllTours = async (req, res) => {
  try {
    const features = new APIFeatures(Tour, req.query);
    features.filter().sort().limitFields().paginate();

    const tours = await features.query;
    res
      .status(200)
      .json({ status: 'success', results: tours.length, data: { tours } });
  } catch (err) {
    console.log(err);
    res.status(404).json({ status: 'fail', message: err });
  }
};

exports.getTour = async (req, res) => {
  try {
    // const foundTour = await Tour.find({ _id: req.params.id });
    const foundTour = await Tour.findById(req.params.id);
    res.status(200).json({ status: 'success', data: { tour: foundTour } });
  } catch (err) {
    return res.status(404).send({ status: 'fail', message: err });
  }
};
exports.createTour = async (req, res) => {
  // const newTour = new Tour(req.body);
  // newTour.save();
  // if wants to return error if field dont match
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({ status: 'success', data: { tour: newTour } });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json({ status: 'success', data: { tour: tour } });
  } catch (err) {
    return res.status(404).send({ status: 'fail', message: err });
  }
};
exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({ status: 'success', data: null });
  } catch (err) {
    return res.status(404).send({ status: 'fail', message: err });
  }
};
exports.getTourStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } },
      },
      {
        $group: {
          _id: { $toUpper: '$difficulty' },
          numTours: { $sum: 1 },
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
      {
        $sort: { avgPrice: 1 },
      },
    ]);
    res.status(200).json({ status: 'success', data: stats });
  } catch (err) {
    res.status(404).json({
      stats: 'fail',
      message: err,
    });
  }
};
