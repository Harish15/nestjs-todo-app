import { CreateTodoInput, SubtaskInput, UpdateTodoInput } from './todo.dto';
import { Todo } from './todo.schema';

export class TodoFactory {
  static create(input: CreateTodoInput): CreateTodoInput {
    return {
      title: input.title,
      priority: input.priority ?? 'MEDIUM', // Default to 'MEDIUM' if undefined
      completed: input.completed ?? false, // Default to false
      subtasks:
        input.subtasks?.map((subtask) => this.createSubtask(subtask)) ?? [],
    };
  }

  static update(input: UpdateTodoInput, existingTodo?: Todo): UpdateTodoInput {
    return {
      id: input.id,
      title: input.title ?? existingTodo?.title, //  Keep existing title if not provided
      priority: input.priority ?? existingTodo?.priority, //  Keep existing priority
      completed: input.completed ?? existingTodo?.completed, //  Keep existing status

      // ✅ Update subtask if `_id` matches, otherwise keep the existing one
      subtasks: input.subtasks
        ? (existingTodo?.subtasks?.map((subtask) => {
            const updatedSubtask = input.subtasks?.find(
              (s) => s._id === subtask._id,
            );
            return updatedSubtask ? { ...subtask, ...updatedSubtask } : subtask;
          }) ??
          (existingTodo?.subtasks || []))
        : existingTodo?.subtasks || [],
    };
  }

  private static createSubtask(subtask: SubtaskInput): SubtaskInput {
    return {
      _id: subtask._id,
      title: subtask.title,
      completed: subtask.completed ?? false, // Default subtasks to incomplete
    };
  }
}
