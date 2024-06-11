import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Observable, firstValueFrom } from 'rxjs';
import { ClientGrpc, RpcException } from '@nestjs/microservices';
import {
    InvalidPasswordException,
    NotFoundException,
    UserNotFoundException,
} from 'src/common/exceptions/exceptions';
import { ChangePasswordRequestDTO, SignInRequestDTO } from './sign-in.dto';
import { SignInResponse } from 'src/proto_build/auth/signIn/SignInResponse';
import {ChangePasswordResponse} from 'src/proto_build/auth/signIn/ChangePasswordResponse';

interface SignInService {
    signIn(data: SignInRequestDTO): Observable<SignInResponse>;
    changePassword(data: ChangePasswordRequestDTO): Observable<ChangePasswordResponse>
}

@Injectable()
export class AuthServiceSignIn implements OnModuleInit {
    private iSignInService: SignInService;

    constructor(@Inject('GRPC_AUTH_SERVICE') private client: ClientGrpc) {}

    onModuleInit() {
        this.iSignInService = this.client.getService<SignInService>('SignInService');
    }

    async signIn(data: SignInRequestDTO): Promise<SignInResponse> {
        try {
            // console.log('service SignIn')
            const signInResponse: SignInResponse = await firstValueFrom(
                this.iSignInService.signIn(data),
            );
            return signInResponse;
        } catch (e) {
            // console.log(e);
            let errorDetails: { error?: string };

            try {
                errorDetails = JSON.parse(e.details);
            } catch (parseError: any) {
                console.error('Error parsing details:', parseError);
                throw new NotFoundException(String(e), 'Error not recognized');
            } // console.log(errorDetails);
            if (errorDetails.error == 'USER_NOT_FOUND') {
                throw new UserNotFoundException();
            } else if (errorDetails.error == 'INVALID_PASSWORD') {
                throw new InvalidPasswordException();
            } else if (errorDetails.error == 'USER_NOT_VERIFIED') {
                throw new UserNotFoundException('User not verified');
            } else if (errorDetails.error == 'TENANT_NOT_FOUND') {
                throw new UserNotFoundException('Tenant not found');
            } else if (errorDetails.error == 'TENANT_NOT_ACTIVED') {
                throw new UserNotFoundException('Tenant not actived');
            } else if (errorDetails.error == 'TENANT_NOT_VERIFIED') {
                throw new UserNotFoundException('Tenant not verified');
            } else {
                throw new NotFoundException(
                    `Unhandled error type: ${errorDetails.error}`,
                    'Error not recognized',
                );
            }
        }
    }

    async changePassword(data: ChangePasswordRequestDTO): Promise<ChangePasswordResponse> {
        try {
            // console.log('service SignIn')
            const response: ChangePasswordResponse = await firstValueFrom(
                this.iSignInService.changePassword(data),
            );
            return response;
        } catch (e) {
            // console.log(e);
            let errorDetails: { error?: string };

            try {
                errorDetails = JSON.parse(e.details);
            } catch (parseError: any) {
                console.error('Error parsing details:', parseError);
                throw new NotFoundException(String(e), 'Error not recognized');
            } // console.log(errorDetails);
            if (errorDetails.error == 'USER_NOT_FOUND') {
                throw new UserNotFoundException();
            } else if (errorDetails.error == 'INVALID_PASSWORD') {
                throw new InvalidPasswordException();
            } else if (errorDetails.error == 'USER_NOT_VERIFIED') {
                throw new UserNotFoundException('User not verified');
            } 
            else if (errorDetails.error == 'TENANT_NOT_FOUND') {
                throw new UserNotFoundException('Tenant not found');
            } else if (errorDetails.error == 'TENANT_NOT_ACTIVED') {
                throw new UserNotFoundException('Tenant not actived');
            } else if (errorDetails.error == 'TENANT_NOT_VERIFIED') {
                throw new UserNotFoundException('Tenant not verified');
            } 
            else {
                throw new NotFoundException(
                    `Unhandled error type: ${errorDetails.error}`,
                    'Error not recognized',
                );
            }
        }
    }
}
