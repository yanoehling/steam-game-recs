import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type GameDocument = Game & Document;

@Schema({ timestamps: true })
export class Game {
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
    friends: string[];

}

export const UserSchema = SchemaFactory.createForClass(Game);