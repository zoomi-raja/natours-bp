const fs = require('fs');
const Tour = require('./../models/tourModel');
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
    // build query
    // filtring
    const queryObj = { ...req.query };
    const excludeFields = ['page', 'sort', 'limit', 'fields'];
    excludeFields.forEach((el) => delete queryObj[el]);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    let query = Tour.find(JSON.parse(queryStr));

    // sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.replace(/,+/g, ' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // fields limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }
    // pagination
    // page=2&limit=10
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);
    if (req.query.page) {
      const newTours = await Tour.countDocuments();
      if (skip >= newTours) throw new Error('this page does not exists');
    }

    const tours = await query;
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
