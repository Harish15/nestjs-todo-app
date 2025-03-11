import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Counter, Histogram } from 'prom-client';

@Injectable()
export class MonitoringMiddleware implements NestMiddleware {
  private readonly httpRequestCount: Counter<string>;
  private readonly httpRequestDuration: Histogram<string>;

  constructor() {
    this.httpRequestCount = new Counter({
      name: 'http_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'route', 'status'],
    });

    this.httpRequestDuration = new Histogram({
      name: 'http_request_duration_seconds',
      help: 'Histogram of response times',
      labelNames: ['method', 'route', 'status'],
      buckets: [0.1, 0.3, 0.5, 1, 2, 5, 10], // Time in seconds
    });
  }

  use(req: Request, res: Response, next: NextFunction): void {
    const start = Date.now();

    res.on('finish', () => {
      const duration = (Date.now() - start) / 1000; // Convert to seconds
      try {
        this.httpRequestCount.inc({
          method: req.method,
          route: req.originalUrl,
          status: res.statusCode.toString(),
        });

        this.httpRequestDuration.observe(
          {
            method: req.method,
            route: req.originalUrl,
            status: res.statusCode.toString(),
          },
          duration,
        );
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error(`[MonitoringMiddleware] Error recording metrics: ${error.message}`);
        }
      }
    });

    next();
  }
}
