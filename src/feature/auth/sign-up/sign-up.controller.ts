import { Body, Controller, Inject, Post } from '@nestjs/common';
import {AuthServiceSignUp} from './sign-up.service';
import {SignUpRequest} from 'src/proto-build/sign_up/SignUpRequest';

@Controller('/auth')
export class SignUpController {
    constructor(
        @Inject('GRPC_AUTH_SERVICE_SIGN_UP')
        private readonly authServiceSignUp: AuthServiceSignUp,
    ) {}
    
    @Post('sign-up')
    async signUp(@Body() signUpRequest: SignUpRequest) {
        return await this.authServiceSignUp.signUp(signUpRequest);
    }
}
