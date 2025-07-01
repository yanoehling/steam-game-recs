import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './users.schema';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { JwtService } from '@nestjs/jwt';
import { Game, GameDocument } from 'src/games/games.schema';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private usersCollection: Model<UserDocument>,
        @InjectModel(Game.name) private gamesCollection: Model<GameDocument>,
        private jwtService: JwtService,
    ) {}

    async create(user: CreateUserDto) {
        const alreadyExistingUser = await this.usersCollection.findOne({ username: user.username }).exec()
        
        if (alreadyExistingUser) {
            throw new BadRequestException("already existing user")
        }
        
        const newUser = await this.usersCollection.create(user)
        
        if (newUser && newUser._id) {
            return {
                msg: "user created successfully",
                token: this.jwtService.sign({
                    _id: newUser._id,
                })
            }
        } else {
            throw new InternalServerErrorException('could not create user account');
        }
    }

    async checkUsers(username: string) {
        const user = await this.usersCollection.findOne({ username: username }).exec()
        if (user) {
            return {
                userExists: true,
            }
        }

        return {
            msg: "username avaiable to be used",
            userExists: false,
        }
    }

    async getLoggedUser(id: string) {
        const user = await this.usersCollection.findById(id).exec()
        if (!user) {
            throw new NotFoundException("could not find user with given _id")
        }

        return user
    }

    async update(id: string, updatedUser: UpdateUserDto) {
        let user = await this.usersCollection.findById(id).exec()
        if (!user) {
            throw new NotFoundException("could not find user with this _id")
        }

        const updatedUserSuccessfully = await this.usersCollection.updateOne({
            _id: id
        },  { $set: updatedUser }).exec()
        if (!updatedUserSuccessfully.modifiedCount) {
            throw new InternalServerErrorException("could not update user")
        }
        return {
            msg: "Sucesso ao editar perfil"
        }
    }
 
    async getUser(id: string) {
        const user = await this.usersCollection.findById(id).exec()

        if (!user) {
            throw new NotFoundException("could not find user with this _id")
        }

        const { password, ...safeUserCredentials } = user.toObject();

        return safeUserCredentials;
    }

    async getUsers() {
        const users = await this.usersCollection.find().exec()

        return users
    }

    async delete(id: string) {
        const deleteUserAccount = await this.usersCollection.findByIdAndDelete(id).exec()
       
        if (!deleteUserAccount) {
            throw new NotFoundException('could not find user with given _id');
        }   

        return {
            msg: "user account deleted successfully"
        }
    }

    async getFriendList(id: string) {
        const user = await this.usersCollection.findById(id).exec()
        if (!user) {
            throw new NotFoundException("could not find user with given _id")
        }

        return user.friends
    }

    async addFriend(userId: string, friendName: string) {
        const user = await this.usersCollection.findById(userId).exec()
        if (!user) {
            throw new NotFoundException("could not find user")
        }

        const friend = await this.usersCollection.findOne({
            username: friendName
        }).exec()
        if (!friend) {
            throw new NotFoundException("could not find friend with given username")
        }

        if (userId == friend.id) {
            throw new ForbiddenException("user cannot add itself as friend")
        }

        const alreadyFriends = 
            (user.friends.filter(f => f.id == friend.id).length != 0) 
            ||
            (friend.friends.filter(f => f.id == userId).length != 0)

        if (alreadyFriends) {
            throw new ForbiddenException("users are already friends")
        }

        user.friends.push({
            id: friend.id,
            recommendations: [],
        })

        const addedUserToNewFriendFriends = await user.save()

        friend.friends.push({
            id: userId,
            recommendations: [],
        })

        const addedFriendToUserFriends = await friend.save()

        if (!addedFriendToUserFriends || !addedUserToNewFriendFriends) {
            throw new InternalServerErrorException("could not add friend")
        }

        return {
            msg: "friend added successfully"
        }
    }

    async removeFriend(userId: string, friendName: string) {
        const user = await this.usersCollection.findById(userId).exec()
        if (!user) {
            throw new NotFoundException("could not find user")
        }

        const friend = await this.usersCollection.findOne({
            username: friendName
        }).exec()
        if (!friend) {
            throw new NotFoundException("could not find friend with given username")
        }

        if (userId == friend.id) {
            throw new ForbiddenException("user cannot remove itself as friend")
        }

        const alreadyFriends = 
            (user.friends.filter(f => f.id == friend.id).length != 0) 
            ||
            (friend.friends.filter(f => f.id == userId).length != 0)
        
        if (alreadyFriends) {
            throw new BadRequestException("users are not friends")
        }

        user.friends.filter( f => f.id != friend.id)

        const removedUserToNewFriendFriends = await user.save()

        friend.friends.filter( friend => friend.id != userId)

        const removedFriendToUserFriends = await friend.save()

        if (!removedUserToNewFriendFriends || !removedFriendToUserFriends) {
            throw new InternalServerErrorException("could not remove friend")
        }

        return {
            msg: "friend removed successfully"
        }
    }

    async addRecommendation(userId: string, friendName: string, recommendation: string) {
        const user = await this.usersCollection.findById(userId).exec();
        if (!user) {
            throw new NotFoundException("could not find user");
        }

        const friend = await this.usersCollection.findOne({ username: friendName }).exec();
        if (!friend) {
            throw new NotFoundException("could not find friend");
        }

        if (userId == friend.id) {
            throw new ForbiddenException("user cannot remove recommendation to itself");
        }

        const recommendationGame = await this.gamesCollection.findById(recommendation).exec();
        if (!recommendationGame) {
            throw new NotFoundException("could not find recommended game");
        }

        const alreadyFriends =
            user.friends.some(f => f.id == friend.id) ||
            friend.friends.some(f => f.id == userId);

        if (!alreadyFriends) {
            throw new ForbiddenException("users are not friends");
        }

        const friendEntry = user.friends.find(f => f.id == friend.id);

        if (!friendEntry) {
            throw new NotFoundException("friend not found in user's friends list");
        }

        const hasRecommendation = friendEntry.recommendations.includes(recommendation);

        if (!hasRecommendation) {
            throw new BadRequestException("this recommendation does not exist");
        }

        const removedRecommendation = await this.usersCollection.updateOne(
            { _id: userId, "friends.id": friend.id },
            { $pull: { "friends.$.recommendations": recommendation } }
        );

        if (removedRecommendation.modifiedCount === 0) {
            throw new InternalServerErrorException("could not remove recommendation");
        }

        return {
            msg: "recommendation removed successfully",
        };

    }

    async removeRecommendation(userId: string, friendName: string, recommendation: string) {
        const user = await this.usersCollection.findById(userId).exec();
        if (!user) {
            throw new NotFoundException("could not find user");
        }

        const friend = await this.usersCollection.findOne({ username: friendName }).exec();
        if (!friend) {
            throw new NotFoundException("could not find friend");
        }

        if (userId == friend.id) {
            throw new ForbiddenException("user cannot remove recommendation to itself");
        }

        const alreadyFriends =
            user.friends.some(f => f.id == friend.id) ||
            friend.friends.some(f => f.id == userId);

        if (!alreadyFriends) {
            throw new ForbiddenException("users are not friends");
        }

        const friendEntry = user.friends.find(f => f.id == friend.id);
        if (!friendEntry) {
            throw new NotFoundException("friend not found in user's friends list");
        }

        const hasRecommendation = friendEntry.recommendations.includes(recommendation);
        if (!hasRecommendation) {
            throw new BadRequestException("this recommendation does not exist");
        }

        const removedRecommendation = await this.usersCollection.updateOne(
            { _id: userId, "friends.id": friend.id },
            { $pull: { "friends.$.recommendations": recommendation } }
        );

        if (removedRecommendation.modifiedCount === 0) {
            throw new InternalServerErrorException("could not remove recommendation");
        }

        return {
            msg: "recommendation removed successfully",
        };
    }
}
