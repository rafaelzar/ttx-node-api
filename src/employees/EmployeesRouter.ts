import { Router, Request, Response, NextFunction, response } from 'express';
import { updateEmployeeDto } from '../middleware/dto/update-employee.dto';
import { validateJWT } from '../middleware/validate-jwt';
import EmployeesController from './EmployeesController';
import { validateMongoId } from '../middleware/validate-mongo-id';
import autoBind from 'auto-bind';
import { validateQueryParam } from '../middleware/validate-query-param';
import { tokenExchangeDto } from '../middleware/dto/token-exchange.dto';

class EmployeesRouter {
  private _router = Router();
  private _controller = EmployeesController;

  get router() {
    return this._router;
  }

  constructor() {
    autoBind(this._controller);
    this._configure();
  }

  private _configure() {
    this._router.get('/validate-jwt', validateJWT, this._controller.validateJwt);
    this._router.patch('/:id', validateMongoId, updateEmployeeDto, validateJWT, this._controller.updateEmployee);
    this._router.get('/reviews/:id', validateMongoId, validateQueryParam, this._controller.getReviews);
    this._router.get('/create-link-token/:id', validateMongoId, validateJWT, this._controller.createLinkToken);
    this._router.post(
      '/token-exchange:/:id',
      validateMongoId,
      tokenExchangeDto,
      validateJWT,
      this._controller.exchangeToken,
    );
  }
}

export = new EmployeesRouter().router;
