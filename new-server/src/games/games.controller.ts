import { Body, Controller, Get, HttpCode, Param, Post, Req, UseGuards } from '@nestjs/common';
import { CreateGameDto, GetGameDto } from './games.dto';
import { GamesService } from './games.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('games')
export class GamesController {
    constructor(private readonly gamesService: GamesService) {}

    @UseGuards(AuthGuard('jwt'))
    @Post()
    @HttpCode(201)
    async createGame(@Body() game: CreateGameDto, @Req() req) {
        return this.gamesService.createGame(game, req.user.username)
    }

    @Get()
    @HttpCode(200)
    async getGames() {
        return this.gamesService.getGames()
    }

    @Get(":id")
    @HttpCode(200)
    async getGame(@Param("id") id: string) {
        return this.gamesService.getGame(id)
    }   
}