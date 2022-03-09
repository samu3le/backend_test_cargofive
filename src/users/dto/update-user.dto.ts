import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { ApiProperty } from '@nestjs/swagger';
import {
    IsNotEmpty,
    IsNumber,
    ValidateIf,
    IsAlphanumeric,
    IsBoolean,
} from 'class-validator';
import { IsEqualTo } from 'src/common/decorators';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @ApiProperty({ required: false })
    @IsNotEmpty()
    @IsNumber()
    id: number;

    @ApiProperty({ required: false })
    @ValidateIf((data) => data.is_active)
    @IsBoolean()
    is_active?: boolean;

    @ApiProperty({ required: false })
    @ValidateIf((data) => data.password)
    @IsAlphanumeric()
    @IsNotEmpty()
    @IsEqualTo('password')
    passwordConfirmation: string;
}
