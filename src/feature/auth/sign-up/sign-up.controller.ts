import { Body, Controller, Inject, Post, Res } from '@nestjs/common';
import { AuthServiceSignUp } from './sign-up.service';
import { SignUpRequestDto } from './sign-up.dto';
import {
    ApiBadRequestResponse,
    ApiBody,
    ApiCreatedResponse,
    ApiForbiddenResponse,
    ApiOperation,
    ApiProperty,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
    ApiBodyExample,
    ApiEndpoint,
    ApiErrorResponses,
    ApiResponseExample,
} from 'src/common/decorator/swagger.decorator';

@Controller('auth')
@ApiTags('auth')
export class SignUpController {
    constructor(
        @Inject('GRPC_AUTH_SERVICE_SIGN_UP')
        private readonly authServiceSignUp: AuthServiceSignUp,
    ) {}

    @Post('sign-up')
    @ApiEndpoint({
        summary: `Sign Up`,
        details: `
## Description
Sign Up within a domain. 
        
## Optional
- **role**: Must provide a valid role if want to sign up by tenant.
`,
    })
    @ApiBodyExample(SignUpRequestDto, {
        email: 'nguyenvukhoi150402@gmail.com',
        username: 'nguyenvukhoi150402',
        phone: '84931056895',
        password: 'A@a123456',
        role: 2,
        companyName: 'Cong ty 30 shine',
        companyAddress: 'O dau con lau moi noi',
    })
    @ApiResponseExample('create', 'Sign Up', { result: 'success' }, '/api/auth/sign-up')
    @ApiErrorResponses('/api/auth/sign-up', '/api/auth/sign-up', {
        badRequest: {
            summary: 'Validation Error',
            detail: 'email should not be empty, email must be an email, username should not be empty, username must be a string, phone should not be empty, Must be VietNam Phone Number (84..), phone must be a string, Password must have non-empty password., domain should not be empty, domain must be a valid domain name, device should not be empty, device must be a string',
        },
        forbidden: [
            {
                key: 'user_already_registered',
                summary: 'User already registered',
                detail: 'User already registered',
            },
            {
                key: 'tenant_already_registered',
                summary: 'Tenant already registered',
                detail: 'Tenant already registered',
            },
            {
                key: 'email_already_registered',
                summary: 'Email already registered',
                detail: 'Email already registered',
            },
        ],
    })
    async signUp(@Body() data: SignUpRequestDto) {
        return await this.authServiceSignUp.signUp(data);
    }
}
