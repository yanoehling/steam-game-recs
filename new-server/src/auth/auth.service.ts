import { Injectable, NotFoundException } from '@nestjs/common';
import { LoginDto } from './auth.dto';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/users/users.schema';
import { Model } from 'mongoose';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        @InjectModel(User.name) private usersCollection: Model<UserDocument>,
    ){}

    async login(login: LoginDto) {
        const checkIfUserLoginIsValid = await this.usersCollection.findOne({
            username: login.username,
            password: login.password,
        })

        if (!checkIfUserLoginIsValid) {
            throw new NotFoundException("user with these credentials does not exist")
        }

        return {
            token: this.jwtService.sign({
                _id: checkIfUserLoginIsValid._id,
            }),
        }
    }
}
