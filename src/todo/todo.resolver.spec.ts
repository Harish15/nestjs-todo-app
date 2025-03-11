import { Test, TestingModule } from '@nestjs/testing';
import { TodoResolver } from './todo.resolver';
import { TodoService } from './todo.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { CreateTodoInput, UpdateTodoInput } from './todo.dto';
import { Todo } from './todo.schema';

describe('TodoResolver', () => {
  let resolver: TodoResolver;
  let todoService: TodoService;

  const mockTodoService = {
    findAll: jest.fn().mockResolvedValue([{ id: '1', title: 'Test Todo' }]),
    findById: jest.fn().mockResolvedValue({ id: '1', title: 'Test Todo' }),
    create: jest.fn().mockImplementation((input: CreateTodoInput) =>
      Promise.resolve({ id: '1', ...input })
    ),
    update: jest.fn().mockImplementation((id: string, input: UpdateTodoInput) =>
      Promise.resolve(input)
    ),
    delete: jest.fn().mockResolvedValue({ message: 'Todo deleted successfully' }),
  };

  const mockLogger = {
    log: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoResolver,
        { provide: TodoService, useValue: mockTodoService },
        { provide: WINSTON_MODULE_PROVIDER, useValue: mockLogger },
      ],
    }).compile();

    resolver = module.get<TodoResolver>(TodoResolver);
    todoService = module.get<TodoService>(TodoService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  it('should return all todos', async () => {
    await expect(resolver.getTodos()).resolves.toEqual([{ id: '1', title: 'Test Todo' }]);
    expect(mockTodoService.findAll).toHaveBeenCalled();
  });

  it('should return a todo by ID', async () => {
    await expect(resolver.getTodoById('1')).resolves.toEqual({ id: '1', title: 'Test Todo' });
    expect(mockTodoService.findById).toHaveBeenCalledWith('1');
  });

  it('should create a todo', async () => {
    const input: CreateTodoInput = { title: 'New Todo', priority: 'LOW' };
    await expect(resolver.createTodo(input)).resolves.toEqual({ id: '1', ...input });
    expect(mockTodoService.create).toHaveBeenCalledWith(input);
  });

  it('should update a todo', async () => {
    const input: UpdateTodoInput = { id: '1', title: 'Updated Todo' };
    const expectedResult = { id: '1', title: 'Updated Todo' };
  
    await expect(resolver.updateTodo(input)).resolves.toEqual(expectedResult);
    expect(mockTodoService.update).toHaveBeenCalledWith(input.id, input);
  });
  

  it('should delete a todo', async () => {
    await expect(resolver.deleteTodo('1')).resolves.toEqual('Todo deleted successfully');
    expect(mockTodoService.delete).toHaveBeenCalledWith('1');
  });
});
