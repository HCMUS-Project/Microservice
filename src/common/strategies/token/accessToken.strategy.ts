import { CACHE_MANAGER, CacheStore } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Role } from 'src/common/guards/role/role.enum';

type JwtPayload = {
    user_id: string;
    domain: string;
    email: string;
    role: Role[];
};

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(@Inject(CACHE_MANAGER) private cacheManager: CacheStore) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_ACCESS_SECRET,
            passReqToCallback: true,
        });
    }

    async validate(req, payload: JwtPayload) {
        var accessToken = await this.cacheManager.get(
            `access_token:${payload.email}/${payload.domain}/${req.headers.authorization.split(' ')[1]}`,
        );
        // console.log(req.headers.authorization.split(' ')[1])
        console.log(accessToken, payload);
        return payload;
    }
}
