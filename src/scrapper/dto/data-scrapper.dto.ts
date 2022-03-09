import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength } from 'class-validator';

export class DataScrapperDto {
    @ApiProperty({ required: true })
    @IsNotEmpty()
    @MinLength(5)
    category: string;
}
