import { Body, Controller, Inject, Post, Res } from '@nestjs/common';
import { AuthServiceSignUp } from './sign-up.service';
import {SignUpRequestDto} from './sign-up.dto';

@Controller('/auth')
export class SignUpController {
    constructor(
        @Inject('GRPC_AUTH_SERVICE_SIGN_UP')
        private readonly authServiceSignUp: AuthServiceSignUp,
    ) {}

    @Post('sign-up')
    async signUp(@Body() data: SignUpRequestDto) {
        return await this.authServiceSignUp.signUp(data); 
    }
}
