import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as csrf from 'csurf';

@Injectable()
export class CsrfMiddleware implements NestMiddleware {
  private readonly csrfProtection: (
    req: Request,
    res: Response,
    next: (err?: Error) => void,
  ) => void;

  constructor() {
    this.csrfProtection = csrf({ cookie: true }) as (
      req: Request,
      res: Response,
      next: (err?: Error) => void,
    ) => void;
  }

  use(req: Request, res: Response, next: NextFunction): void {
    this.csrfProtection(req, res, (err?: unknown) => {
      if (err instanceof Error) {
        res.status(403).json({ message: err.message });
      } else {
        next();
      }
    });
  }
}
