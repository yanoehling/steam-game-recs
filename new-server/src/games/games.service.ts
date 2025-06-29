import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Game, GameDocument } from './games.schema';
import { JwtService } from '@nestjs/jwt';
import { CreateGameDto } from './games.dto';

@Injectable()
export class GamesService {
    constructor(
        @InjectModel(Game.name) private gamesCollection: Model<GameDocument>,
        private jwtService: JwtService,
    ) {}

    async createGame(game: CreateGameDto, dev: string) {
        try {

            await this.gamesCollection.create(
                {
                    ...game,
                    dev,
                }
            )
            
            return {
                msg: "game created successfully"
            }
        } catch (e) {
            throw new InternalServerErrorException("could not create game")
        }
    }

    async getGames() {
        const games = await this.gamesCollection.find().exec()
        return games
    }

    async getGame(id: string) {
        const game = await this.gamesCollection.findById(id).exec()

        if (!game) {
            throw new NotFoundException("could not find game with given _id")
        }

        return game
    }
}
