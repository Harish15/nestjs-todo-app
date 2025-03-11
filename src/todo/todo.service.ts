import { Injectable, NotFoundException, LoggerService, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Model } from 'mongoose';
import { Todo, TodoDocument } from './todo.schema';
import {
  CreateTodoInput,
  UpdateTodoInput,
  FilterTodoInput,
  PaginationInput,
  SortInput,
} from './todo.dto';
import { TodoFactory } from './todo.factory'; // ✅ Using Factory

@Injectable()
export class TodoService {
  constructor(
    @InjectModel(Todo.name) private todoModel: Model<TodoDocument>,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: LoggerService,
  ) {}

  async findAll(
    filters?: FilterTodoInput,
    pagination?: PaginationInput,
    sort?: SortInput,
  ): Promise<Todo[]> {
    this.logger.log({ level: 'info', message: 'Fetching all todos...' });

    const { page = 1, limit = 10 } = pagination || {};
    const { field = 'createdAt', order = 'desc' } = sort || {};
    const query: any = {};
    if (filters?.title) query.title = { $regex: filters.title, $options: 'i' };
    if (filters?.completed !== undefined) query.completed = filters.completed;
    if (filters?.priority) query.priority = filters.priority;

    this.logger.log({
      level: 'debug',
      message: `Query Filters: ${JSON.stringify(query)}, Pagination: page=${page}, limit=${limit}`,
    });

    return this.todoModel
      .aggregate([
        { $match: query },
        { $sort: { [field]: order === 'asc' ? 1 : -1 } },
        { $skip: (page - 1) * limit },
        { $limit: limit },
      ])
      .exec();
  }

  async findById(id: string): Promise<Todo> {
    this.logger.log({ level: 'info', message: `Fetching todo with ID: ${id}` });

    const todo = await this.todoModel.findById(id).exec();
    if (!todo) {
      this.logger.warn({ level: 'warn', message: `Todo with ID: ${id} not found` });
      throw new NotFoundException(`Todo with id "${id}" not found`);
    }

    return todo;
  }

  async create(createTodoInput: CreateTodoInput): Promise<Todo> {
    this.logger.log({ level: 'info', message: 'Creating a new todo...', createTodoInput });

    const todoData = TodoFactory.create(createTodoInput);
    // const newTodo = await new this.todoModel(todoData).save();
    const newTodo = await this.todoModel.create(todoData); // ✅ Correct

    this.logger.log({
      level: 'info',
      message: `Todo created successfully with ID: ${newTodo._id}`,
    });
    return newTodo;
  }

  async update(id: string, updateTodoInput: UpdateTodoInput): Promise<Todo> {
    this.logger.log({ level: 'info', message: `Updating todo with ID: ${id}`, updateTodoInput });

    const todo = await this.todoModel.findById(id);
    if (!todo) {
      this.logger.warn({ level: 'warn', message: `Todo with ID: ${id} not found` });
      throw new NotFoundException(`Todo with id "${id}" not found`);
    }

    if (updateTodoInput.title) todo.title = updateTodoInput.title;
    if (updateTodoInput.completed !== undefined) todo.completed = updateTodoInput.completed;
    if (updateTodoInput.priority) todo.priority = updateTodoInput.priority;

    if (updateTodoInput.subtasks) {
      updateTodoInput.subtasks.forEach((updatedSubtask) => {
        todo.subtasks = todo?.subtasks?.map((subtask) =>
          subtask._id.toString() === updatedSubtask._id
            ? { ...subtask, ...updatedSubtask }
            : subtask,
        );
      });
    }

    const updatedTodo = await todo.save();
    this.logger.log({
      level: 'info',
      message: `Todo updated successfully with ID: ${updatedTodo._id}`,
    });
    return updatedTodo;
  }

  async delete(id: string): Promise<{ message: string }> {
    this.logger.log({ level: 'info', message: `Deleting todo with ID: ${id}` });

    const deletedTodo = await this.todoModel.findByIdAndDelete(id).exec();
    if (!deletedTodo) {
      this.logger.warn({ level: 'warn', message: `Todo with ID: ${id} not found` });
      throw new NotFoundException(`Todo with id "${id}" not found`);
    }

    this.logger.log({ level: 'info', message: `Todo deleted successfully with ID: ${id}` });
    return { message: 'Todo deleted successfully' };
  }
}
