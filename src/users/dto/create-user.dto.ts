import { ApiProperty } from '@nestjs/swagger';
import {
    IsAlphanumeric,
    IsNotEmpty,
    IsString,
    IsEmail,
    MinLength,
    MaxLength,
    ValidateIf,
} from 'class-validator';
import { IsEqualTo } from 'src/common/decorators';

export class CreateUserDto {
    @ApiProperty({ required: true })
    @IsEmail()
    @IsNotEmpty()
    @MinLength(5)
    email: string;

    @ApiProperty({ required: true })
    @IsString()
    @IsNotEmpty()
    @MinLength(5)
    @MaxLength(25)
    name: string;

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
