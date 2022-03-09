import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { SignupDto } from './dto/signup.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { hashData } from '../helper/hashData';
import { Tokens } from './types';
import { jwtConstants } from './constants';
import { SigninDto } from './dto/signin.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private prisma: PrismaService,
    ) { }

    async signIn(signinDto: SigninDto) {
        const user = await this.usersService.findUser(signinDto.email);
        const passwordMatches = await bcrypt.compare(
            signinDto.password,
            user.password,
        );

        if (!passwordMatches) throw new ForbiddenException('Error', 'Access Denied, Verify Password');

        const tokens = await this.getTokens(user.id, user.email);
        await this.updateRtHash(user.id, tokens.refresh_token);
        const data = {
            'name': user?.name,
            'email': user.email,
            'token': tokens,
        }
        return {
            'data': data,
            'message': 'User signed in successfully.',
        };
    }

    async getTokens(userId: number, email: string): Promise<Tokens> {
        const [jwt, rt] = await Promise.all([
            this.jwtService.signAsync(
                {
                    sub: userId,
                    email,
                },
                {
                    secret: jwtConstants.secret,
                    expiresIn: 60 * 15,
                },
            ),
            this.jwtService.signAsync(
                {
                    sub: userId,
                    email,
                },
                {
                    secret: jwtConstants.secret_refresh,
                    expiresIn: 60 * 60 * 24 * 7,
                },
            ),
        ]);
        return {
            access_token: jwt,
            refresh_token: rt,
        };

    }

    async signUp(signupDto: SignupDto) {
        const hash = await hashData(signupDto.password);
        const newUser = await this.prisma.users.create({
            data: {
                email: signupDto.email,
                password: hash,
            },
        });
        const tokens = await this.getTokens(newUser.id, newUser.email);
        await this.updateRtHash(newUser.id, tokens.refresh_token);

        const data = {
            'name': newUser?.name,
            'email': newUser.email,
            'token': tokens,
        }
        return {
            'data': data,
            'message': 'User created successfully.',
        };
    }

    async updateRtHash(userId: number, refreshToken: string) {
        const hash = await hashData(refreshToken);
        await this.prisma.users.update({
            where: { id: userId },
            data: { hashedRT: hash },
        })
    }

    async signOut(userId: number): Promise<any> {
        const logoutUser = await this.prisma.users.updateMany({
            where: {
                id: userId,
                hashedRT: {
                    not: null,
                }
            },
            data: {
                hashedRT: null,
            }

        })
        if (!logoutUser) throw new ForbiddenException('Error', 'Error to Logout');

        return logoutUser;
    }

    async refreshTokens(userId: number, refreshToken: string) {
        const user = await this.usersService.findOne(userId);
        if (!user || !user.hashedRT) throw new ForbiddenException('Access Denied');

        const rtMatches = await bcrypt.compare(refreshToken, user.hashedRT);
        if (!rtMatches) throw new ForbiddenException('Access Denied');

        const tokens = await this.getTokens(user.id, user.email);
        await this.updateRtHash(user.id, tokens.refresh_token);
        return tokens;
    }
}
