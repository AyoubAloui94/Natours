const APIFeatures = require('../utilities/apiFeatures');
const AppError = require('../utilities/appError');
const catchAsync = require('../utilities/catchAsync');

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const docToDelete = await Model.findOneAndDelete({ _id: req.params.id });

    if (!docToDelete) {
      return next(new AppError('No document with that ID was found.', 404));
    }

    res.status(204).json({ status: 'success', data: null });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const docToUpdate = await Model.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!docToUpdate) {
      return next(new AppError('No document with that ID was found.', 404));
    }

    res.status(200).json({ status: 'success', data: { docToUpdate } });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const newDoc = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: { newDoc },
    });
  });

exports.getOne = (Model, populateOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findOne({ _id: req.params.id });
    if (populateOptions) query = query.populate(populateOptions);
    const doc = await query;
    if (!doc) {
      return next(new AppError('No document with that ID was found.', 404));
    }
    res.status(200).json({ status: 'success', data: { doc } });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    // allows nested GET reviews on tour
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };
    if (req.params.userId) filter = { user: req.params.userId };

    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const docs = await features.query;
    //const docs = await features.query.explain();

    res.status(200).json({
      status: 'success',
      results: docs.length,
      data: { docs },
    });
  });
