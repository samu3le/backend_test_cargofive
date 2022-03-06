import { ApiProperty } from '@nestjs/swagger';
import {
    IsAlphanumeric,
    IsNotEmpty,
    IsEmail,
    MinLength,
    ValidateIf,
} from 'class-validator';
import { IsEqualTo } from 'src/decorador/CustomMatchPasswords.decorador';

export class SignupDto {
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

    @ApiProperty({ required: true })
    @ValidateIf(data => data.password)
    @IsAlphanumeric()
    @IsNotEmpty()
    @IsEqualTo('password')
    passwordConfirmation: string;
}
