import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Observable, firstValueFrom } from 'rxjs';
import { ClientGrpc } from '@nestjs/microservices';
import {
    ForbiddenException,
    NotFoundException,
    UserNotFoundException,
} from 'src/common/exceptions/exceptions';
import { SignOutRequestDTO } from './sign-out.dto';
import { SignOutResponse } from 'src/proto_build/auth/signOut/SignOutResponse';

interface SignOutService {
    signOut(data: SignOutRequestDTO): Observable<SignOutResponse>;
}

@Injectable()
export class AuthServiceSignOut implements OnModuleInit {
    private iSignOutService: SignOutService;

    constructor(@Inject('GRPC_AUTH_SERVICE') private client: ClientGrpc) {}

    onModuleInit() {
        this.iSignOutService = this.client.getService<SignOutService>('SignOutService');
    }

    async signOut(data: SignOutRequestDTO): Promise<SignOutResponse> {
        try {
            const signOutResponse: SignOutResponse = await firstValueFrom(
                this.iSignOutService.signOut(data),
            );
            return signOutResponse;
        } catch (e) {
            // console.log(e)
            let errorDetails: { error?: string };

            try {
                errorDetails = JSON.parse(e.details);
            } catch (parseError: any) {
                console.error('Error parsing details:', parseError);
                throw new NotFoundException(String(e), 'Error not recognized');
            } // console.log(errorDetails);
            if (errorDetails.error == 'INVALID_ACCESS_TOKEN') {
                throw new ForbiddenException('Invalid access token', 'Forbidden');
            } else {
                throw new NotFoundException(
                    `Unhandled error type: ${errorDetails.error}`,
                    'Error not recognized',
                );
            }
        }
    }
}
