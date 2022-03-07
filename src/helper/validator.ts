import { Injectable } from '@nestjs/common';
import {
    ValidationArguments,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';
import { PrismaService } from 'src/prisma/prisma.service';

@ValidatorConstraint({ name: 'UserExists', async: true })
@Injectable()
export class UserExistsRule implements ValidatorConstraintInterface {
    constructor(private prisma: PrismaService) { }

    async validate(value: string) {

        const user = await this.prisma.users.findUnique({
            where: { email: value },
        });
        if (!user) return true;
        return false;
    }
    defaultMessage(args: ValidationArguments) {
        return `Email already exist`;
    }
}