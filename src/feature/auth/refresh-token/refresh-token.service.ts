import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Observable, firstValueFrom } from 'rxjs';
import { ClientGrpc } from '@nestjs/microservices';
import { ForbiddenException, NotFoundException } from 'src/common/exceptions/exceptions';
import { RefreshTokenRequestDTO } from './refresh-token.dto';
import { RefreshTokenResponse } from 'src/proto_build/auth/refreshToken/RefreshTokenResponse';

interface RefreshTokenService {
    refreshToken(data: RefreshTokenRequestDTO): Observable<RefreshTokenResponse>;
}

@Injectable()
export class AuthServiceRefreshToken implements OnModuleInit {
    private iRefreshTokenService: RefreshTokenService;

    constructor(@Inject('GRPC_AUTH_SERVICE') private client: ClientGrpc) {}

    onModuleInit() {
        this.iRefreshTokenService =
            this.client.getService<RefreshTokenService>('RefreshTokenService');
    }

    async refreshToken(data: RefreshTokenRequestDTO): Promise<RefreshTokenResponse> {
        try {
            console.log(data);
            const refreshTokenResponse: RefreshTokenResponse = await firstValueFrom(
                this.iRefreshTokenService.refreshToken(data),
            );
            return refreshTokenResponse;
        } catch (e) {
            // console.log(e)
            let errorDetails: { error?: string };
            try {
                errorDetails = JSON.parse(e.details);
            } catch (parseError) {
                console.error('Error parsing details:', parseError);
                throw new NotFoundException(String(e), 'Error not recognized');
            }
            // console.log(errorDetails);
            if (errorDetails.error == 'INVALID_REFRESH_TOKEN') {
                throw new ForbiddenException('Invalid refresh token', 'Forbidden');
            } else if (errorDetails.error == 'REFRESH_TOKEN_EXPIRED') {
                throw new ForbiddenException('Refresh token expired', 'Forbidden');
            }
            {
                throw new NotFoundException(
                    `Unhandled error type: ${errorDetails.error}`,
                    'Error not recognized',
                );
            }
        }
    }
}
