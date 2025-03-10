import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateTodoInput {
  @Field()
  title: string;

  @Field({ nullable: true })
  priority?: string;

  @Field({ nullable: true })
  completed?: boolean;

  @Field(() => [SubtaskInput], { nullable: true })
  subtasks?: SubtaskInput[];
}

@InputType()
export class UpdateTodoInput {
  @Field()
  id: string;

  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  completed?: boolean;

  @Field({ nullable: true })
  priority?: string;

  @Field(() => [SubtaskInput], { nullable: true })
  subtasks?: SubtaskInput[];
}

@InputType()
export class SubtaskInput {
  @Field({nullable: true})
  _id?: string;

  @Field()
  title?: string;

  @Field({ nullable: true, defaultValue: false })
  completed?: boolean;
}

@InputType()
export class FilterTodoInput {
  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  completed?: boolean;

  @Field({ nullable: true })
  priority?: string;
}

@InputType()
export class PaginationInput {
  @Field({ nullable: true, defaultValue: 1 })
  page?: number;

  @Field({ nullable: true, defaultValue: 10 })
  limit?: number;
}

@InputType()
export class SortInput {
  @Field({ nullable: true })
  field?: string;

  @Field({ nullable: true, defaultValue: 'asc' })
  order?: 'asc' | 'desc';
}
