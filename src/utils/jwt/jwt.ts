import { CACHE_MANAGER, CacheStore } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Role } from 'src/common/enums/role.enum';

@Injectable()
export class Jwt {
    private accessTokenSecret: string;
    private refreshTokenSecret: string;

    constructor(
        private readonly jwtService: JwtService,
        configService: ConfigService,
        @Inject(CACHE_MANAGER) private cacheManager: CacheStore,
    ) {
        this.accessTokenSecret = configService.get<string>('JWT_ACCESS_SECRET');
        this.refreshTokenSecret = configService.get<string>('JWT_REFRESH_SECRET');
    }

    async createAccessToken(
        user_id: string,
        email: string,
        domain: String,
        role: Role,
    ): Promise<string> {
        const accessToken = await this.jwtService.signAsync(
            {
                user_id,
                domain,
                email,
                role,
            },
            {
                secret: this.accessTokenSecret,
                expiresIn: '15m',
            },
        );
        return accessToken;
    }

    async createRefreshToken(user_id: string, email: string, domain: String): Promise<string> {
        const refreshToken = await this.jwtService.signAsync(
            {
                user_id,
                domain,
                email,
            },
            {
                secret: this.refreshTokenSecret,
                expiresIn: '1d',
            },
        );
        return refreshToken;
    }

    async saveToken(email: string, domain: string, accessToken: string, refreshToken: string) {
        // Save token to redis
        try {
            this.cacheManager.set(`access_token:${email}/${domain}/${accessToken}`, accessToken, {
                ttl: 900,
            });

            this.cacheManager.set(`refresh_token:${email}/${domain}/${refreshToken}`, accessToken, {
                ttl: 86400,
            });
        } catch (error) {
            throw error;
        }
    }

    async verifyToken(token: string) {
        try {
            const decoded = this.jwtService.verify(token);
            return decoded;
        } catch (error) {
            throw error;
        }
    }
}
