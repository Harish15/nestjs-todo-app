import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Inject, LoggerService } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { TodoService } from './todo.service';
import {
  CreateTodoInput,
  UpdateTodoInput,
  FilterTodoInput,
  PaginationInput,
  SortInput,
} from './todo.dto';
import { Todo } from './todo.schema';

@Resolver(() => Todo)
export class TodoResolver {
  constructor(
    private readonly todoService: TodoService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: LoggerService, //Inject Winston Logger
  ) {}

  @Query(() => [Todo])
  async getTodos(
    @Args('filters', { nullable: true }) filters?: FilterTodoInput,
    @Args('pagination', { nullable: true }) pagination?: PaginationInput,
    @Args('sort', { nullable: true }) sort?: SortInput,
  ) {
    this.logger.log({
      level: 'info',
      message: 'Fetching all todos via GraphQL Query',
      filters,
      pagination,
      sort,
    });

    return this.todoService.findAll(filters, pagination, sort);
  }

  @Query(() => Todo, { nullable: true })
  async getTodoById(@Args('id') id: string) {
    this.logger.log({ level: 'info', message: `Fetching todo by ID: ${id}` });

    return this.todoService.findById(id);
  }

  @Mutation(() => Todo)
  async createTodo(@Args('input') input: CreateTodoInput) {
    this.logger.log({
      level: 'info',
      message: 'Creating new todo via GraphQL Mutation',
      input,
    });

    return this.todoService.create(input);
  }

  @Mutation(() => Todo)
  async updateTodo(@Args('input') input: UpdateTodoInput) {
    this.logger.log({
      level: 'info',
      message: `Updating todo with ID: ${input.id} via GraphQL Mutation`,
      input,
    });

    return this.todoService.update(input.id, input);
  }

  @Mutation(() => String)
  async deleteTodo(@Args('id') id: string) {
    this.logger.log({
      level: 'info',
      message: `Deleting todo with ID: ${id} via GraphQL Mutation`,
    });

    const result = await this.todoService.delete(id);
    return result.message;
  }
}
