import { Body, Controller, Inject, Post, UseGuards } from '@nestjs/common';
import { AuthServiceSignIn } from './sign-in.service';
import {SignInRequestDTO} from './sign-in.dto'; 

@Controller('/auth')
export class SignInController {
    constructor(
        @Inject('GRPC_AUTH_SERVICE_SIGN_IN')
        private readonly authServiceSignIn: AuthServiceSignIn,
    ) {}

    @Post('sign-in')
    async signIn(@Body() data: SignInRequestDTO) {
        return await this.authServiceSignIn.signIn(data); 
    }
}
