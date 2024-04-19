import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { ValidationFailedException } from 'src/common/exceptions/exceptions';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_REFRESH_SECRET,
            passReqToCallback: true,
        });
    }

    validate(req: Request, payload: any) {
        const authHeader = req.headers.authorization;
        console.log(authHeader);
        if (!authHeader) {
            console.log(1);
            // throw new UnauthorizedException('Authorization header is missing');
            throw new ValidationFailedException(
                'Authorization refresh token failed',
                'Authorization header is missing',
            );
        }
        if (!authHeader.startsWith('Bearer ')) {
            console.log(2);
            // throw new UnauthorizedException('Invalid Authorization header format');
            throw new ValidationFailedException(
                'Authorization refresh token failed',
                'Invalid Authorization header format',
            );
        }
        const refreshToken = authHeader.replace('Bearer ', '').trim();
        console.log(refreshToken);
        console.log(payload);
        return { ...payload, refreshToken };
    }
}
