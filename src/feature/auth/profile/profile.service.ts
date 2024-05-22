import {
    BadRequestException,
    Inject,
    Injectable,
    InternalServerErrorException,
    OnModuleInit,
} from '@nestjs/common';
import { Observable, firstValueFrom } from 'rxjs';
import { ClientGrpc } from '@nestjs/microservices';
import {
    ForbiddenException,
    NotFoundException,
    UserNotFoundException,
} from 'src/common/exceptions/exceptions';
import { GetProfileRequestDTO, UpdateProfileRequestDTO } from './profile.dto';
import { GetProfileResponse } from 'src/proto_build/auth/profile/GetProfileResponse';
import { UpdateProfileResponse } from 'src/proto_build/auth/profile/UpdateProfileResponse';

interface ProfileService {
    getProfile(data: GetProfileRequestDTO): Observable<GetProfileResponse>;
    updateProfile(data: UpdateProfileRequestDTO): Observable<UpdateProfileResponse>;
}

@Injectable()
export class AuthServiceProfile implements OnModuleInit {
    private iProfileService: ProfileService;

    constructor(@Inject('GRPC_AUTH_SERVICE') private client: ClientGrpc) {}

    onModuleInit() {
        this.iProfileService = this.client.getService<ProfileService>('ProfileService');
    }

    async getProfile(data: GetProfileRequestDTO): Promise<GetProfileResponse> {
        try {
            const getProfileResponse: GetProfileResponse = await firstValueFrom(
                this.iProfileService.getProfile(data),
            );
            return getProfileResponse;
        } catch (e) {
            // console.log(e)
            let errorDetails: { error?: string };
            try {
                errorDetails = JSON.parse(e.details);
            } catch (parseError) {
                console.error('Error parsing details:', parseError);
                throw new NotFoundException(String(e), 'Error not recognized');
            }
            // console.log(errorDetails);
            if (errorDetails.error == 'USER_NOT_FOUND') {
                throw new UserNotFoundException();
            } else if (errorDetails.error == 'USER_NOT_ACTIVE') {
                throw new UserNotFoundException('User not verified', 'Forbidden');
            }
            {
                throw new NotFoundException(
                    `Unhandled error type: ${errorDetails.error}`,
                    'Error not recognized',
                );
            }
        }
    }

    async updateProfile(data: UpdateProfileRequestDTO): Promise<UpdateProfileResponse> {
        try {
            const updateProfileResponse: UpdateProfileResponse = await firstValueFrom(
                this.iProfileService.updateProfile(data),
            );
            return updateProfileResponse;
        } catch (e) {
            // console.log(e)
            let errorDetails: { error?: string };
            try {
                errorDetails = JSON.parse(e.details);
            } catch (parseError) {
                console.error('Error parsing details:', parseError);
                throw new NotFoundException(String(e), 'Error not recognized');
            }
            // console.log(errorDetails);
            if (errorDetails.error == 'USER_NOT_FOUND') {
                throw new UserNotFoundException();
            } else if (errorDetails.error == 'USER_NOT_ACTIVE') {
                throw new UserNotFoundException('User not verified', 'Forbidden');
            } else if (errorDetails.error == 'UPDATE_PROFILE_FAILED') {
                throw new ForbiddenException('Update profile failed', 'Forbidden');
            } else if (errorDetails.error == 'UPDATE_USERNAME_USER_FAILED') {
                throw new ForbiddenException('Update username of User table failed', 'Forbidden');
            }
            {
                throw new NotFoundException(
                    `Unhandled error type: ${errorDetails.error}`,
                    'Error not recognized',
                );
            }
        }
    }
}
