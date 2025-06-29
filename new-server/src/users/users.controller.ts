import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AddFriendDto, AddRecommendationDto, CheckUserDto, CreateUserDto, GetFriendDto, GetUserByIdDto, RemoveFriendDto, RemoveRecommendationDto, UpdateUserDto } from './user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}
  
    @Post()
    @HttpCode(201)
    create(@Body() user: CreateUserDto) {
        return this.usersService.create(user)
    }

    @Get("check")
    @HttpCode(200)
    checkUser(@Query() username: CheckUserDto) {
        return this.usersService.checkUser(username.username)
    }

    @Get()
    @HttpCode(200)
    getUsers() {
        return this.usersService.getUsers()
    }

    @Get(":id")
    @HttpCode(200)
    getUser(@Param('id') id: GetUserByIdDto) {
        return this.usersService.getUser(id.id)
    }

    @UseGuards(AuthGuard('jwt'))
    @Patch()
    @HttpCode(200)
    updateUser(@Req() req, @Body() updatedUser: UpdateUserDto) {
        return this.usersService.update(req.user._id, updatedUser)
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete()
    @HttpCode(200)
    deleteUser(@Req() req) {
        return this.usersService.delete(req.user._id)
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('add/friend/:friendId')
    @HttpCode(201)
    addFriend(@Req() req, @Param("friendId") friendId: AddFriendDto) {
        return this.usersService.addFriend(req.user._id, friendId.friendId)
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete("remove/friend/:friendId")
    @HttpCode(200)
    removeFriend(@Req() req, @Param("friendId") friendId: RemoveFriendDto) {
        return this.usersService.removeFriend(req.user._id, friendId.friendId)
    }

    @UseGuards(AuthGuard("jwt"))
    @Post("add/recommendation/:friendId")
    @HttpCode(201)
    addRecommendation(@Req() req, @Param("friendId") friendId: GetFriendDto, @Query() recommendation: AddRecommendationDto) {
        return this.usersService.addRecommendation(req.user._id, friendId.friendId, recommendation.recommendation)
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete("remove/recommendation/:friendId")
    @HttpCode(200)
    removeRecommendation(@Req() req, @Param("friendId") friendId: GetFriendDto, @Query() recommendation: RemoveRecommendationDto) {
        return this.usersService.removeRecommendation(req.user._id, friendId.friendId, recommendation.recommendation)
    }
}
