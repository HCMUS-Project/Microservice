import { Body, Controller, Inject, Post, UseGuards } from '@nestjs/common';
import {AuthServiceSignIn} from './sign-in.service';
import {SignInRequest} from 'src/proto-build/sign_in/SignInRequest';
import {AccessTokenGuard} from 'src/common/guards/token/accessToken.guard';

@Controller('/auth')
export class SignInController {
    constructor(
        @Inject('GRPC_AUTH_SERVICE_SIGN_IN')
        private readonly authServiceSignIn: AuthServiceSignIn,
    ) {}
    
    @Post('sign-in')
    async signIn(@Body() signInRequest: SignInRequest) {
        return await this.authServiceSignIn.signIn(signInRequest);
    }

    @UseGuards(AccessTokenGuard)
    @Post('test-token')
    testToken(@Body() hi: string): string{
        return 'success test-token'
    }
}