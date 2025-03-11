import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as onFinished from 'on-finished';
import { performance } from 'perf_hooks';

@Injectable()
export class ProfilingMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const startTime = performance.now();

    onFinished(res, (err: unknown) => {
      if (err) {
        console.error('[PROFILE] Error occurred:', err instanceof Error ? err.message : err);
        return;
      }

      const endTime = performance.now();
      const duration = endTime - startTime;

      // Extract GraphQL operation name
      let operationName = 'Unknown Operation';
      if (req.body && typeof req.body === 'object' && req.body.operationName) {
        operationName = req.body.operationName;
      }

      console.log(
        `[PROFILE] ${req.method} ${req.originalUrl} (${operationName}) - ${duration.toFixed(2)} ms`,
      );
    });

    next();
  }
}
