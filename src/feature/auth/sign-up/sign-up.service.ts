import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Observable, firstValueFrom } from 'rxjs';
import { ClientGrpc } from '@nestjs/microservices';
import {
    ForbiddenException,
    NotFoundException,
    UserNotFoundException,
} from 'src/common/exceptions/exceptions';
import { SignUpRequestDto } from './sign-up.dto';
import {SignUpResponse} from 'src/proto_build/auth/signUp/SignUpResponse';

interface SignUpService {
    signUp(data: SignUpRequestDto): Observable<SignUpResponse>;
}

@Injectable()
export class AuthServiceSignUp implements OnModuleInit {
    private iSignUpService: SignUpService;

    constructor(@Inject('GRPC_AUTH_SERVICE') private client: ClientGrpc) {}

    onModuleInit() {
        this.iSignUpService = this.client.getService<SignUpService>('SignUpService');
    }

    async signUp(data: SignUpRequestDto): Promise<SignUpResponse> {
        try {
            const signUpResponse: SignUpResponse = await firstValueFrom(
                this.iSignUpService.signUp(data),
            );
            return signUpResponse;
        } catch (e) {
            // console.log(e)
            const errorDetails = JSON.parse(e.details);
            // console.log(errorDetails);
            if (errorDetails.error == 'USER_ALREADY_REGISTER') {
                throw new ForbiddenException('User already registered', 'Forbidden');
            } else {
                throw new NotFoundException(errorDetails, 'Not found');
            }
        }
    }
}
