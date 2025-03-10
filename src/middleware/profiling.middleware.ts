import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as onFinished from 'on-finished';
import { performance } from 'perf_hooks';

@Injectable()
export class ProfilingMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const startTime = performance.now();

    onFinished(res, () => {
      const endTime = performance.now();
      const duration = endTime - startTime;

      // Extract GraphQL operation name
      let operationName = 'Unknown Operation';
      if (req.body && typeof req.body === 'object') {
        operationName = req.body.operationName || 'Unnamed Operation';
      }

      console.log(
        `[PROFILE] ${req.method} ${req.originalUrl} (${operationName}) - ${duration.toFixed(2)} ms`,
      );
    });

    next();
  }
}
