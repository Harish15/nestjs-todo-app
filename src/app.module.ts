import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { TodoModule } from './todo/todo.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

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
            query {
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
             query {
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
            mutation {
              createTodo(input: {
                title: "Complete Assesment Tasks",
                completed: false,
                priority: "HIGH",
                subtasks: [{title: "Learn http2", completed: true}]
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
            mutation {
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
            mutation {
              deleteTodo(id: "67ceb5fdeac02dc42db6bc8f")
            }`,
          },
        ],
      },
      introspection: true,
    }),

    // ✅ Import Todo Module
    TodoModule,
  ],
})
export class AppModule {}
