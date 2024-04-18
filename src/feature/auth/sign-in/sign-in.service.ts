import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Observable, firstValueFrom } from 'rxjs';
import { ClientGrpc } from '@nestjs/microservices'; 
import {SignInRequest} from 'src/proto-build/sign_in/SignInRequest';
import {SignInResponse} from 'src/proto-build/sign_in/SignInResponse';

interface SignInService {
    signIn(data: SignInRequest): Observable<SignInResponse>;
}

@Injectable()
export class AuthServiceSignIn implements OnModuleInit {
    private iSignInService: SignInService;

    constructor(@Inject('GRPC_AUTH_SERVICE') private client: ClientGrpc) {}

    onModuleInit() {
        this.iSignInService = this.client.getService<SignInService>('SignInService');
    }

    async signIn(data: SignInRequest): Promise<SignInResponse> {
        const signInResponse: SignInResponse = await firstValueFrom(this.iSignInService.signIn(data));
        return signInResponse;
    }
}