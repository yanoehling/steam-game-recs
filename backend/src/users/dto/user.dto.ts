import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export default class UserDTO {
    @IsNotEmpty()
    @IsString()
    completeName: string;

    @IsNotEmpty()
    @IsString()
    userName: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;

    @IsNotEmpty()
    @IsString()
    dateOfBirth: string;
}