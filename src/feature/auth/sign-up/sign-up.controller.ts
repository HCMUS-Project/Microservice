import { Body, Controller, Inject, Post, Res } from '@nestjs/common';
import { AuthServiceSignUp } from './sign-up.service';
import { SignUpRequest } from 'src/proto-build/signUp/SignUpRequest';
import {Response} from 'express';

@Controller('/auth')
export class SignUpController {
    constructor(
        @Inject('GRPC_AUTH_SERVICE_SIGN_UP')
        private readonly authServiceSignUp: AuthServiceSignUp,
    ) {}

    @Post('sign-up')
    async signUp(@Body() signUpRequest: SignUpRequest) {
        const result = await this.authServiceSignUp.signUp(signUpRequest);
        // if (result.result){
        //     return res.status(200).json({
        //         'message': 
        //     })
        // }
        return result
    }
}
