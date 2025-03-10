import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as csrf from 'csurf';

@Injectable()
export class CsrfMiddleware implements NestMiddleware {
  private readonly csrfProtection;

  constructor() {
    this.csrfProtection = csrf({ cookie: true });
  }

  use(req: Request, res: Response, next: NextFunction) {
    this.csrfProtection(req, res, (err) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid CSRF Token' });
      }
      next();
    });
  }
}
