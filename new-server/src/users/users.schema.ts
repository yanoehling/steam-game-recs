import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    username: string;

    @Prop({ required: true })
    email: string;

    @Prop({ required: true })
    birthday: string;

    @Prop({ required: true })
    password: string;

    @Prop({ required: false })
    friends: { id: string, recommendations: string[] }[];

}

export const UserSchema = SchemaFactory.createForClass(User);