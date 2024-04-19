import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Observable, firstValueFrom } from 'rxjs';
import { ClientGrpc } from '@nestjs/microservices';
import { SignUpRequest } from 'src/proto-build/signUp/SignUpRequest';
import { SignUpResponse } from 'src/proto-build/signUp/SignUpResponse';

interface SignUpService {
    signUp(data: SignUpRequest): Observable<SignUpResponse>;
}

@Injectable()
export class AuthServiceSignUp implements OnModuleInit {
    private iSignUpService: SignUpService;

    constructor(@Inject('GRPC_AUTH_SERVICE') private client: ClientGrpc) {}

    onModuleInit() {
        this.iSignUpService = this.client.getService<SignUpService>('SignUpService');
    }

    async signUp(data: SignUpRequest): Promise<SignUpResponse> {
        const signUpResponse: SignUpResponse = await firstValueFrom(
            this.iSignUpService.signUp(data),
        );
        return signUpResponse;
    }
}
