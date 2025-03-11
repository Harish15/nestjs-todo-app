import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { TodoModule } from './todo/todo.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { CsrfMiddleware } from './middleware/csrf.middleware';
import { CsrfController } from './csrf.controller';
import { ProfilingMiddleware } from './middleware/profiling.middleware'; // Import Profiling Middleware
import { MonitoringModule } from './monitoring/monitoring.module';
import { MonitoringMiddleware } from './middleware/monitoring.middleware';
import { WinstonModule } from 'nest-winston';
import { winstonLogger } from './logger/winston.logger';

@Module({
  imports: [
    // ✅ Load Environment Variables
    ConfigModule.forRoot({
      isGlobal: true, // Makes config available globally
    }),

    // ✅ Use MongoDB URL from .env
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
    }),

    // ✅ GraphQL Configuration with Custom Playground Tabs
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      // driver: ApolloDriver,
      // autoSchemaFile: true,
      path: '/playground', // Set GraphQL endpoint to '/playground'
      playground: {
        endpoint: '/playground',
        settings: {
          'editor.theme': 'dark',
          'request.credentials': 'same-origin',
        },
        tabs: [
          {
            endpoint: '/playground',
            name: 'Get All Todos',
            query: `
            query getTodos{
              getTodos(filters: { completed: false, priority: "HIGH" }, sort: { field: "createdAt", order: "desc" }, pagination:{page: 1, limit: 5}) {
                _id
                title
                completed
                priority
                createdAt
                subtasks{_id, title, completed}
              }
            }`,
          },
          {
            endpoint: '/playground',
            name: 'Get Todo by ID',
            query: `
             query getTodoById{
              getTodoById(id: "67ceab7ea0ff198c37f7aa83") {
                _id
                title
                completed
                priority
                createdAt
                subtasks{_id, title, completed}
              }
            }`,
          },
          {
            endpoint: '/playground',
            name: 'Create Todo',
            query: `
            mutation createTodo{
              createTodo(input: {
                title: "New todo task",
                completed: false,
                priority: "MEDIUM",
                subtasks: [{title: "Subtask 1", completed: true}]
              }) {
                _id
                title
                completed
                priority
                createdAt
                subtasks{_id, title, completed}
              }
            }`,
          },
          {
            endpoint: '/playground',
            name: 'Update Todo',
            query: `
            mutation updateTodo{
              updateTodo(
                input: {
                  id: "67cec8a5d3e8e8fa6b65096c",
                  title: "updatest new title",
                  completed: false,
                  priority: "LOW",
                  subtasks: [{
                    _id: "67cec8a5d3e8e8fa6b65096e",
                    title: "subtask 2",
                    completed: true
                  }]
                }
              ) {
                _id
                title
                completed
                priority
                createdAt
                subtasks {
                  _id
                  title
                  completed
                }
              }
            }`,
          },
          {
            endpoint: '/playground',
            name: 'Delete Todo',
            query: `
            mutation deleteTodo{
              deleteTodo(id: "67ceb5fdeac02dc42db6bc8f")
            }`,
          },
        ],
      },
      introspection: true,
    }),
    WinstonModule.forRoot({
      transports: winstonLogger.transports, 
    }),
    // ✅ Import Todo Module
    TodoModule,
    MonitoringModule,
  ],
  controllers: [CsrfController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        cookieParser(),
        CsrfMiddleware,
        ProfilingMiddleware,
        MonitoringMiddleware,
      )
      .forRoutes('*'); // Apply to all routes
  }
}
