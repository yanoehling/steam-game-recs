// src/auth/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User, UserDocument } from '../users/users.schema';
import { Model } from 'mongoose';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor( @InjectModel(User.name) private usersCollection: Model<UserDocument>,) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // pega do header
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'TRABALHO_WEB_YAN_PATRICK_RAIDEN_JULIO',
    });
  }

  async validate(payload: { _id: string }) {
    const user = await this.usersCollection.findById(payload._id);

    if (!user) {
      throw new UnauthorizedException('Usuário não existe');
    }

    return user; // vai estar disponível como req.user nas rotas protegidas
  }
}
