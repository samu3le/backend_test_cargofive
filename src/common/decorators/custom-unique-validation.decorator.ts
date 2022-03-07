import { registerDecorator, ValidationOptions } from 'class-validator';
import { UserExistsRule } from 'src/helper/validator';

export function UserExists(validationOptions?: ValidationOptions) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            name: 'UserExists',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: UserExistsRule,
        });
    };
}