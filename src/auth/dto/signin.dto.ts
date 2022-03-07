import { ApiProperty } from '@nestjs/swagger';
import {
    IsAlphanumeric,
    IsNotEmpty,
    IsEmail,
    MinLength,
} from 'class-validator';

export class SigninDto {
    @ApiProperty({ required: true })
    @IsEmail()
    @IsNotEmpty()
    @MinLength(5)
    email: string;

    @ApiProperty({ required: true })
    @IsAlphanumeric()
    @IsNotEmpty()
    @MinLength(5)
    password: string;
}
