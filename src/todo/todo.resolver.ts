import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { TodoService } from './todo.service';
import {
  CreateTodoInput,
  UpdateTodoInput,
  FilterTodoInput,
  PaginationInput,
  SortInput,
} from './todo.dto';
import { Todo } from './todo.schema'; // ✅ Import Todo from the schema file

@Resolver(() => Todo)
export class TodoResolver {
  constructor(private readonly todoService: TodoService) {}

  @Query(() => [Todo])
  async getTodos(
    @Args('filters', { nullable: true }) filters?: FilterTodoInput,
    @Args('pagination', { nullable: true }) pagination?: PaginationInput,
    @Args('sort', { nullable: true }) sort?: SortInput,
  ) {
    return this.todoService.findAll(filters, pagination, sort);
  }

  // ✅ Get Todo by ID
  @Query(() => Todo, { nullable: true })
  async getTodoById(@Args('id') id: string) {
    return this.todoService.findById(id);
  }

  @Mutation(() => Todo)
  async createTodo(@Args('input') input: CreateTodoInput) {
    return this.todoService.create(input);
  }

  @Mutation(() => Todo)
  async updateTodo(@Args('input') input: UpdateTodoInput) {
    return this.todoService.update(input.id, input);
  }

  @Mutation(() => String)
  async deleteTodo(@Args('id') id: string) {
    const result = await this.todoService.delete(id);
    return result.message;
  }
}
