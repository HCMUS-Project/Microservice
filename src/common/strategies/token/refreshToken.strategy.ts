import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { UserNotFoundException, ValidationFailedException } from 'src/common/exceptions/exceptions';
import {CACHE_MANAGER, CacheStore} from '@nestjs/cache-manager';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor(@Inject(CACHE_MANAGER) private cacheManager: CacheStore) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_REFRESH_SECRET,
            passReqToCallback: true,
        });
    }

    async validate(req, payload: any) {
        var accessToken = await this.cacheManager.get(
            `refresh_token:${payload.email}/${payload.domain}/${req.headers.authorization.split(' ')[1]}`,
        );
        if (!accessToken){
            throw new UserNotFoundException('Refresh Token not found');
        }
        // console.log(accessToken, payload);
        return payload;
    }

    // validate(req: Request, payload: any) {
    //     const authHeader = req.headers.authorization;
    //     console.log(authHeader);
    //     if (!authHeader) {
    //         console.log(1);
    //         throw new UnauthorizedException('Authorization header is missing');
    //         // return new ValidationFailedException(
    //         //     'Authorization refresh token failed',
    //         //     'Authorization header is missing',
    //         // );
    //     }
    //     if (!authHeader.startsWith('Bearer ')) {
    //         console.log(2);
    //         throw new UnauthorizedException('Invalid Authorization header format');
    //         // return new ValidationFailedException(
    //         //     'Authorization refresh token failed',
    //         //     'Invalid Authorization header format',
    //         // );
    //     }
    //     const refreshToken = authHeader.replace('Bearer ', '').trim();
    //     console.log(refreshToken);
    //     console.log(payload);
    //     return { ...payload, refreshToken };
    // }
}
