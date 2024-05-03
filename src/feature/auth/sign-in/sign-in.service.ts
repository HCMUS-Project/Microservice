import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Observable, firstValueFrom } from 'rxjs';
import { ClientGrpc, RpcException } from '@nestjs/microservices';
import {
    InvalidPasswordException,
    NotFoundException,
    UserNotFoundException,
} from 'src/common/exceptions/exceptions';
import { SignInRequestDTO } from './sign-in.dto';
import { SignInResponse } from 'src/proto_build/auth/signIn/SignInResponse';

interface SignInService {
    signIn(data: SignInRequestDTO): Observable<SignInResponse>;
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
            const errorDetails = JSON.parse(e.details);
            // console.log(errorDetails);
            if (errorDetails.error == 'USER_NOT_FOUND') {
                throw new UserNotFoundException();
            } else if (errorDetails.error == 'INVALID_PASSWORD') {
                throw new InvalidPasswordException();
            } else if (errorDetails.error == 'USER_NOT_VERIFIED') {
                throw new UserNotFoundException('User not verified');
            } else {
                throw new NotFoundException(errorDetails, 'Not found');
            }
        }
    }
}
