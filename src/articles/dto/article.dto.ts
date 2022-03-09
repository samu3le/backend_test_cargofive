import { IsNotEmpty } from 'class-validator';
export class ArticleDto {
    @IsNotEmpty()
    author: string;
}
