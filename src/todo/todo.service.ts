import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
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
  constructor(@InjectModel(Todo.name) private todoModel: Model<TodoDocument>) {}

  async findAll(
    filters?: FilterTodoInput,
    pagination?: PaginationInput,
    sort?: SortInput,
  ): Promise<Todo[]> {
    const { page = 1, limit = 10 } = pagination || {};
    const { field = 'createdAt', order = 'desc' } = sort || {};
    const query: any = {};
    if (filters?.title) query.title = { $regex: filters.title, $options: 'i' };
    if (filters?.completed !== undefined) query.completed = filters.completed;
    if (filters?.priority) query.priority = filters.priority;

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
    const todo = await this.todoModel.findById(id).exec();
    if (!todo) throw new NotFoundException(`Todo with id "${id}" not found`);
    return todo;
  }

  async create(createTodoInput: CreateTodoInput): Promise<Todo> {
    const todoData = TodoFactory.create(createTodoInput); // Using Factory Pattern
    return new this.todoModel(todoData).save();
  }

  async update(id: string, updateTodoInput: UpdateTodoInput): Promise<Todo> {
    const todo = await this.todoModel.findById(id);
    if (!todo) {
      throw new NotFoundException(`Todo with id "${id}" not found`);
    }

    // ✅ Update other fields if provided
    if (updateTodoInput.title) {
      todo.title = updateTodoInput.title;
    }
    if (updateTodoInput.completed !== undefined) {
      todo.completed = updateTodoInput.completed;
    }
    if (updateTodoInput.priority) {
      todo.priority = updateTodoInput.priority;
    }

    // ✅ Update only specified subtasks
    if (updateTodoInput.subtasks) {
      updateTodoInput.subtasks.forEach((updatedSubtask) => {
        todo.subtasks = todo?.subtasks?.map((subtask) =>
          subtask._id.toString() === updatedSubtask._id
            ? { ...subtask, ...updatedSubtask } // ✅ Merge updates
            : subtask,
        );
      });
    }

    return todo.save(); // ✅ Save changes and return updated Todo
  }

  async delete(id: string): Promise<{ message: string }> {
    const deletedTodo = await this.todoModel.findByIdAndDelete(id).exec();
    if (!deletedTodo) {
      throw new NotFoundException(`Todo with id "${id}" not found`);
    }
    return { message: 'Todo deleted successfully' };
  }
}
