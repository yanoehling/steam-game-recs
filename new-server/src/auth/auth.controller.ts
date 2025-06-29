import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { LoginDto } from './auth.dto';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private jwtService: JwtService,
    ) {}

    @Post("login")
    @HttpCode(200)
    login(@Body() login: LoginDto) {
        return this.authService.login(login)
    }
}
