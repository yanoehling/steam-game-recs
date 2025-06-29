import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { GamesModule } from './games/games.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    UsersModule, 
    GamesModule,
    MongooseModule.forRoot(
      'mongodb+srv://steamrosa:web123@steamrosa.y714tl8.mongodb.net/todoapp?retryWrites=true&w=majority&appName=SteamRosa'
    ),    
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
