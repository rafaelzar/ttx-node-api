import { NextFunction, Response, Request } from 'express';
import ErrorHandler from '../errors/ErrorHandler';

export const validateQueryParam = (req: Request, _: Response, next: NextFunction) => {
  try {
    const queryObj = { $and: [] } as any;

    if (req.query.platform) {
      const { platform } = req.query;
      const platofrmTypes = ['Weedmaps', 'Yelp', 'Google', 'GMB', 'Eyerate'];
      if (!platofrmTypes.includes(platform as string))
        throw new ErrorHandler(400, 'Platform must match one of the following Weedmaps, Yelp, Google, GMB or Eyerate');
      if (platform !== 'Eyerate') {
        queryObj.$and.push({ platform: platform });
      }
    }

    if (!req.query.startDate && !req.query.endDate) {
      queryObj.$and.push({ date: { $lt: new Date() } });
      queryObj.$and.push({ created_at: { $lt: new Date() } });
    }

    if (req.query.startDate && !req.query.endDate) {
      const startDate = new Date(req.query.startDate as string);
      if (startDate.toString() === 'Invalid Date') {
        throw new ErrorHandler(422, 'Invalid date');
      }

      queryObj.$and.push({ date: { $gt: startDate } });
      queryObj.$and.push({ created_at: { $gt: startDate } });
    }

    if (!req.query.startDate && req.query.endDate) {
      const endDate = new Date(req.query.endDate as string);
      if (endDate.toString() === 'Invalid Date') {
        throw new ErrorHandler(422, 'Invalid date');
      }
      queryObj.$and.push({ date: { $lt: endDate } });
      queryObj.$and.push({ created_at: { $lt: endDate } });
    }

    if (req.query.startDate && req.query.endDate) {
      const startDate = new Date(req.query.startDate as string);
      const endDate = new Date(req.query.endDate as string);
      if (startDate.toString() === 'Invalid Date' || endDate.toString() === 'Invalid Date') {
        throw new ErrorHandler(422, 'Invalid date');
      }
      if (startDate > endDate) {
        throw new ErrorHandler(422, 'Start date must happen before end date');
      }
      queryObj.$and.push({ date: { $gt: startDate, $lt: endDate } });
      queryObj.$and.push({ created_at: { $gt: startDate, $lt: endDate } });
    }
    if (req.query.rating) {
      const rating = Number(req.query.rating);
      if (isNaN(rating)) throw new ErrorHandler(400, 'Rating must be a number');
      queryObj.$and.push({
        rating: { $eq: rating },
      });
    }
    if (req.query.keyword) {
      const keyword = req.query.keyword as string;
      const key = keyword.split('%20').join(' ');

      queryObj.$and.push({ content: { $regex: key, $options: 'i' } });
    }
    if (req.query.eyerate) {
      const eyerate = req.query.eyerate;
      if (!(eyerate === 'true' || eyerate === 'false')) {
        throw new ErrorHandler(400, 'Eyerate must be either true or false');
      }
    }
    const { sort, sortBy } = req.query;
    if (sort && sortBy) {
      if (!(sort === 'desc' || sort === 'asc')) {
        throw new ErrorHandler(400, 'Sort must be either desc or asc');
      }
      if (!(sortBy === 'date' || sortBy === 'rating')) {
        throw new ErrorHandler(400, 'SortBy must be either date or rating');
      }
    } else if ((!sort && sortBy) || (sort && !sortBy)) {
      throw new ErrorHandler(400, 'Both sort and sortBy params required');
    }
    if (req.query.page) {
      const page = Number(req.query.page);
      if (isNaN(page) || page < 1) {
        throw new ErrorHandler(400, 'Page must be a number greater than equal to 1');
      }
    }
    req.queryObj = queryObj;
    next();
  } catch (error) {
    next(error);
  }
};
