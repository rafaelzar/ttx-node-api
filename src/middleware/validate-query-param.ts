import { NextFunction, Response, Request } from 'express';
import ErrorHandler from '../errors/ErrorHandler';

export const validateQueryParam = (req: Request, _: Response, next: NextFunction) => {
  try {
    if (!req.query.platform) req.query.platform = JSON.stringify(['Weedmaps', 'Yelp', 'Google', 'GMB']);
    else {
      const platform = req.query.platform as string;
      if (platform.indexOf(',') > -1) {
        const arr = platform.split(',');
        req.query.platform = JSON.stringify(arr);
      } else {
        req.query.platform = JSON.stringify([platform]);
      }
    }
    next();
  } catch (error) {
    next(error);
  }
};
