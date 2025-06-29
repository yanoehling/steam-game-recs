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
    ) {}

    async create(user: CreateUserDto) {
        try {
            const alreadyExistingUser = await this.usersCollection.findOne({ username: user.username }).exec()
            
            if (alreadyExistingUser) {
                throw new BadRequestException("already existing user")
            }
            
            const newUser = await this.usersCollection.create(user)
            
            if (newUser && newUser._id) {
                return {
                    msg: "user created successfully"
                }
            } else {
                throw new InternalServerErrorException('could not create user account');
            }
        } catch (e) {
            throw new InternalServerErrorException("could not create user account")
        }
    }

    async update(userId: string, updatedUser: UpdateUserDto) {
        try {
            const alreadyExistingUser = await this.usersCollection.findById(userId).exec()
            
            if (!alreadyExistingUser) {
                throw new NotFoundException("could not find user with this _id")
            }
            
            const updatedUserAccount = await this.usersCollection.findByIdAndUpdate(
                {
                    id: userId,
                },
                updatedUser
            )

            
            if (updatedUserAccount) {
                return {
                    msg: "user created successfully"
                }
            } else {
                throw new InternalServerErrorException('could not update user account');
            }
        } catch (e) {
            throw new InternalServerErrorException("could not update user account")
        }
    }

    async checkUser(username: string) {
        const existingUser = await this.usersCollection.findOne({ username: username }).exec()
        
        if (!existingUser) {
            throw new NotFoundException("user does not exist")
        }

        return {
            msg: "user exists"
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

    async addFriend(userId: string, friendId: string) {
        if (userId == friendId) {
            throw new ForbiddenException("user cannot add itself as friend")
        }

        const user = await this.usersCollection.findById(userId).exec()
        if (!user) {
            throw new NotFoundException("could not find user")
        }

        const friend = await this.usersCollection.findById(friendId).exec()
        if (!friend) {
            throw new NotFoundException("could not find friend")
        }

        const alreadyFriends = 
            (user.friends.filter(friend => friend.id == friendId).length != 0) 
            &&
            (friend.friends.filter(friend => friend.id == userId).length != 0)

        if (alreadyFriends) {
            throw new ForbiddenException("users are already friends")
        }

        user.friends.push({
            id: friendId,
            recommendations: [],
        })

        const addedUserToNewFriendFriends = await user.save()

        friend.friends.push({
            id: userId,
            recommendations: [],
        })

        const addedFriendToUserFriends = await user.save()


        if (!addedFriendToUserFriends || !addedUserToNewFriendFriends) {
            throw new InternalServerErrorException("could not add friend")
        }

        return {
            msg: "friend added successfully"
        }
    }

    async removeFriend(userId: string, friendId: string) {
        if (userId == friendId) {
            throw new ForbiddenException("user cannot remove itself as friend")
        }

        const user = await this.usersCollection.findById(userId).exec()
        if (!user) {
            throw new NotFoundException("could not find user")
        }

        const friend = await this.usersCollection.findById(friendId).exec()
        if (!friend) {
            throw new NotFoundException("could not find friend")
        }

        const alreadyFriends = 
            (user.friends.filter(friend => friend.id == friendId).length != 0) 
            &&
            (friend.friends.filter(friend => friend.id == userId).length != 0)

        if (!alreadyFriends) {
            throw new ForbiddenException("users are not already friends")
        }

        user.friends.filter( friend => friend.id != friendId)

        const removedUserToNewFriendFriends = await user.save()

        friend.friends.filter( friend => friend.id != userId)

        const removedFriendToUserFriends = await user.save()

        if (!removedUserToNewFriendFriends || !removedFriendToUserFriends) {
            throw new InternalServerErrorException("could not remove friend")
        }

        return {
            msg: "friend removed successfully"
        }
    }

    async addRecommendation(userId: string, friendId: string, recommendation: string) {
        if (userId == friendId) {
            throw new ForbiddenException("user cannot add recommendation to itself")
        }

        const user = await this.usersCollection.findById(userId).exec()
        if (!user) {
            throw new NotFoundException("could not find user")
        }

        const friend = await this.usersCollection.findById(friendId).exec()
        if (!friend) {
            throw new NotFoundException("could not find friend")
        }

        const recommendationGame = await this.gamesCollection.findById(recommendation).exec()
        if (!recommendationGame) {
            throw new NotFoundException("could not find recommended game")
        }

        const alreadyFriends = 
            (user.friends.filter(friend => friend.id == friendId).length != 0) 
            && 
            (friend.friends.filter(friend => friend.id == userId).length != 0)

        if (!alreadyFriends) {
            throw new ForbiddenException("users are not friends")
        }

        const friendToUpdate = user.friends.find((friend) => friend.id == friendId);

        const userFriendRecommendations = user.friends.find(friend => friend.id == friendId)?.recommendations

        if (userFriendRecommendations?.includes(recommendation)) {
            throw new BadRequestException("friend has already been recommended this game")
        }
       
        friendToUpdate?.recommendations.push(recommendation)

        const updatedUser = await user.save()
        if (!updatedUser) {
            throw new InternalServerErrorException("could not add new recommendation to friend")
        }

        return {
            msg: "added new recommendation to friend successfully",
        }
    }

    async removeRecommendation(userId: string, friendId: string, recommendation: string) {
        if (userId == friendId) {
            throw new ForbiddenException("user cannot add recommendation to itself")
        }

        const user = await this.usersCollection.findById(userId).exec()
        if (!user) {
            throw new NotFoundException("could not find user")
        }

        const friend = await this.usersCollection.findById(friendId).exec()
        if (!friend) {
            throw new NotFoundException("could not find friend")
        }

        const recommendationGame = await this.gamesCollection.findById(recommendation).exec()
        if (!recommendationGame) {
            throw new NotFoundException("could not find recommended game")
        }

        const alreadyFriends = 
            (user.friends.filter(friend => friend.id == friendId).length != 0) 
            && 
            (friend.friends.filter(friend => friend.id == userId).length != 0)

        if (!alreadyFriends) {
            throw new ForbiddenException("users are not friends")
        }

        const friendToUpdate = user.friends.find((friend) => friend.id == friendId);

        const userFriendRecommendations = user.friends.find(friend => friend.id == friendId)?.recommendations

        if (!userFriendRecommendations?.includes(recommendation)) {
            throw new BadRequestException("friend has not been recommended this game")
        }
       
        friendToUpdate?.recommendations.filter(rec => rec != recommendation)

        const updatedUser = await user.save()
        if (!updatedUser) {
            throw new InternalServerErrorException("could not remove recommendation given to friend")
        }

        return {
            msg: "removed recommendation given to friend successfully",
        }
    }
}
