import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Field, ObjectType, InputType } from '@nestjs/graphql';

export type TodoDocument = Todo & Document;

@Schema({ timestamps: true })
@ObjectType()
export class Todo {
  @Field()
  _id: string;

  @Prop({ required: true })
  @Field()
  title: string;

  @Prop({ default: false })
  @Field()
  completed: boolean;

  @Prop({ enum: ['LOW', 'MEDIUM', 'HIGH'], default: 'MEDIUM' })
  @Field({ nullable: true })
  priority?: string;

  @Prop({ type: [{ title: String, completed: Boolean }], default: [] })
  @Field(() => [Subtask], { nullable: true })
  subtasks?: Subtask[];

  @Prop()
  @Field({ nullable: true })
  createdAt?: Date;
}

@ObjectType()
export class Subtask {
  @Field()
  _id: string;
  
  @Field({ nullable: true })
  title?: string;

  @Field({ defaultValue: false })
  completed?: boolean;
}

export const TodoSchema = SchemaFactory.createForClass(Todo);
TodoSchema.index({ title: 'text' }); // Full-text search index
TodoSchema.index({ priority: 1 }); // Index for fast sorting by priority
TodoSchema.index({ createdAt: -1 }); // Sort by latest created todos
