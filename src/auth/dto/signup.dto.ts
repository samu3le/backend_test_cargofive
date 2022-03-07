import { ApiProperty } from '@nestjs/swagger';
import {
    IsAlphanumeric,
    IsNotEmpty,
    IsEmail,
    MinLength,
    ValidateIf,
} from 'class-validator';
import { IsEqualTo, UserExists } from 'src/common/decorators';

export class SignupDto {
    @ApiProperty({ required: true })
    @IsEmail()
    @IsNotEmpty()
    @MinLength(5)
    @UserExists()
    email: string;

    @ApiProperty({ required: true })
    @IsAlphanumeric()
    @IsNotEmpty()
    @MinLength(5)
    password: string;

    @ApiProperty({ required: true })
    @ValidateIf((data) => data.password)
    @IsAlphanumeric()
    @IsNotEmpty()
    @IsEqualTo('password')
    passwordConfirmation: string;
}
