import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { TodoService } from './todo.service';
import { Todo } from './todo.schema';
import { LoggerService } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Model } from 'mongoose';

describe('TodoService', () => {
  let service: TodoService;
  let model: Model<Todo>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoService,
        {
          provide: getModelToken(Todo.name),
          useValue: {
            findById: jest.fn().mockReturnValue({ exec: jest.fn() }),
            findByIdAndDelete: jest.fn().mockReturnValue({ exec: jest.fn() }),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: WINSTON_MODULE_PROVIDER,
          useValue: {
            log: jest.fn(),
            warn: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TodoService>(TodoService);
    model = module.get<Model<Todo>>(getModelToken(Todo.name));
  });

  it('should return a single todo by ID', async () => {
    const mockTodo = { _id: '123', title: 'Test Todo', completed: false };
    jest.spyOn(model, 'findById').mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockTodo),
    } as any);

    const result = await service.findById('123');
    expect(result).toEqual(mockTodo);
  });

  it('should create a new todo', async () => {
    const mockTodo = {
      _id: '123',
      title: 'New Todo',
      completed: false,
      save: jest.fn().mockResolvedValue(this),
    } as unknown as Todo & Document;
    jest.spyOn(model, 'create').mockResolvedValue(mockTodo as any);

    const result = await service.create({ title: 'New Todo' } as any);
    expect(result).toEqual(mockTodo);
  });

  it('should delete a todo', async () => {
    const mockTodo = { _id: '123', title: 'Test Todo', completed: false };
    jest.spyOn(model, 'findByIdAndDelete').mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockTodo),
    } as any);

    const result = await service.delete('123');
    expect(result).toEqual({ message: 'Todo deleted successfully' });
  });
});
