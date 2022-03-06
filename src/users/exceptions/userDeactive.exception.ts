import { NotFoundException } from '@nestjs/common';

export class UserDeactiveException extends NotFoundException {
    constructor() {
        super(`User is deactive`);
    }
}
