import { Observable, firstValueFrom, lastValueFrom, take, toArray } from 'rxjs';
import { Inject, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { ForbiddenException, UserNotFoundException } from 'src/common/exceptions/exceptions';
import { BannerResponse } from 'src/proto_build/tenant/banner/BannerResponse';
import {
    CreateBannerRequestDTO,
    DeleteBannerRequestDTO,
    FindBannerByTenantIdRequestDTO,
    UpdateBannerRequestDTO,
} from './banner.dto';

interface BannerService {
    createBanner(data: CreateBannerRequestDTO): Observable<BannerResponse>;
    findBannerByTenantId(data: FindBannerByTenantIdRequestDTO): Observable<BannerResponse>;
    updateBanner(data: UpdateBannerRequestDTO): Observable<BannerResponse>;
    deleteBanner(data: DeleteBannerRequestDTO): Observable<BannerResponse>;
}

@Injectable()
export class TenantBannerService implements OnModuleInit {
    private iBannerService: BannerService;

    constructor(@Inject('GRPC_TENANT_SERVICE') private client: ClientGrpc) {}

    onModuleInit() {
        this.iBannerService = this.client.getService<BannerService>('BannerService');
    }

    async createBanner(data: CreateBannerRequestDTO): Promise<BannerResponse> {
        try {
            // console.log(this.iBannerService.createTenant(data));
            const bannerResponse: BannerResponse = await firstValueFrom(
                this.iBannerService.createBanner(data),
            );
            return bannerResponse;
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
            if (errorDetails.error == 'PERMISSION_DENIED') {
                throw new UserNotFoundException('Unauthorized Role', 'Unauthorized');
            } else if (errorDetails.error == 'BANNER_ALREADY_EXISTS') {
                throw new ForbiddenException('Banner already exists', 'Forbidden');
            } else if (errorDetails.error == 'INVALID_IMAGE') {
                throw new ForbiddenException('Invalid image', 'Forbidden');
            } else if (errorDetails.error == 'INVALID_TENANT_ID') {
                throw new ForbiddenException('Invalid tenant id', 'Forbidden');
            } else {
                throw new NotFoundException(e, 'Not found');
            }
        }
    }

    async findBannerByTenantId(data: FindBannerByTenantIdRequestDTO): Promise<BannerResponse> {
        try {
            const bannerResponse: BannerResponse = await firstValueFrom(
                this.iBannerService.findBannerByTenantId(data),
            );
            return bannerResponse;
        } catch (e) {
            // console.log(e);
            let errorDetails: { error?: string };
            try {
                errorDetails = JSON.parse(e.details);
            } catch (parseError) {
                console.error('Error parsing details:', parseError);
                throw new NotFoundException(String(e), 'Error not recognized');
            }
            // console.log(errorDetails);
            if (errorDetails.error == 'BANNER_NOT_FOUND') {
                throw new UserNotFoundException('Banner not found');
            } else {
                throw new NotFoundException(
                    `Unhandled error type: ${errorDetails.error}`,
                    'Error not recognized',
                );
            }
        }
    }

    async updateBanner(data: UpdateBannerRequestDTO): Promise<BannerResponse> {
        try {
            // console.log(data)
            const bannerResponse: BannerResponse = await firstValueFrom(
                this.iBannerService.updateBanner(data),
            );
            return bannerResponse;
        } catch (e) {
            // console.log(e);
            let errorDetails: { error?: string };
            try {
                errorDetails = JSON.parse(e.details);
            } catch (parseError) {
                console.error('Error parsing details:', parseError);
                throw new NotFoundException(String(e), 'Error not recognized');
            }
            // console.log(errorDetails);
            if (errorDetails.error == 'PERMISSION_DENIED') {
                throw new UserNotFoundException('Unauthorized Role', 'Unauthorized');
            } else if (errorDetails.error == 'BANNER_NOT_FOUND') {
                throw new UserNotFoundException('Banner not found');
            } else {
                throw new NotFoundException(
                    `Unhandled error type: ${errorDetails.error}`,
                    'Error not recognized',
                );
            }
        }
    }

    async deleteBanner(data: DeleteBannerRequestDTO): Promise<BannerResponse> {
        try {
            const bannerResponse: BannerResponse = await firstValueFrom(
                this.iBannerService.deleteBanner(data),
            );
            return bannerResponse;
        } catch (e) {
            // console.log(e);
            let errorDetails: { error?: string };
            try {
                errorDetails = JSON.parse(e.details);
            } catch (parseError) {
                console.error('Error parsing details:', parseError);
                throw new NotFoundException(String(e), 'Error not recognized');
            }
            // console.log(errorDetails);
            if (errorDetails.error == 'PERMISSION_DENIED') {
                throw new UserNotFoundException('Unauthorized Role', 'Unauthorized');
            } else if (errorDetails.error == 'BANNER_NOT_FOUND') {
                throw new UserNotFoundException('Banner not found');
            } else {
                throw new NotFoundException(
                    `Unhandled error type: ${errorDetails.error}`,
                    'Error not recognized',
                );
            }
        }
    }
}
