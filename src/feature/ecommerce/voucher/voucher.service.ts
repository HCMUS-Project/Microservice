import {
    ForbiddenException,
    Inject,
    Injectable,
    NotFoundException,
    OnModuleInit,
} from '@nestjs/common';
import { CreateVoucherRequest } from 'src/proto_build/e_commerce/voucher/CreateVoucherRequest';
import {
    CreateVoucherDTO,
    DeleteVoucherRequestDTO,
    FindAllVouchersRequestDTO,
    FindVoucherByCodeRequestDTO,
    FindVoucherByIdRequestDTO,
    UpdateVoucherRequestDTO,
} from './voucher.dto';
import { Observable, firstValueFrom } from 'rxjs';
import { VoucherResponse } from 'src/proto_build/e_commerce/voucher/VoucherResponse';
import { ClientGrpc } from '@nestjs/microservices';
import { UserNotFoundException } from 'src/common/exceptions/exceptions';
import { FindAllVouchersResponse } from 'src/proto_build/e_commerce/voucher/FindAllVouchersResponse';
import { DeleteVoucherRequest } from 'src/proto_build/e_commerce/voucher/DeleteVoucherRequest';

interface VoucherService {
    createVoucher(data: CreateVoucherDTO): Observable<VoucherResponse>;
    findAllVouchers(data: FindAllVouchersRequestDTO): Observable<FindAllVouchersResponse>;
    findVoucherById(data: FindVoucherByIdRequestDTO): Observable<VoucherResponse>;
    checkVoucherByCode(data: FindVoucherByCodeRequestDTO): Observable<VoucherResponse>;
    updateVoucher(data: UpdateVoucherRequestDTO): Observable<VoucherResponse>;
    deleteVoucher(data: DeleteVoucherRequestDTO): Observable<VoucherResponse>;
}

@Injectable()
export class EcommerceVoucherService implements OnModuleInit {
    private iVoucherService: VoucherService;

    constructor(@Inject('GRPC_ECOMMERCE_SERVICE') private client: ClientGrpc) {}

    onModuleInit() {
        this.iVoucherService = this.client.getService<VoucherService>('VoucherService');
        // console.log(this.iProductService)
    }

    async createVoucher(data: CreateVoucherDTO): Promise<VoucherResponse> {
        try {
            // console.log(this.iProductService.createProduct(data));
            const createVoucherResponse: VoucherResponse = await firstValueFrom(
                this.iVoucherService.createVoucher(data),
            );
            return createVoucherResponse;
        } catch (e) {
            // console.log(e)
            const errorDetails = JSON.parse(e.details);
            // console.log(errorDetails);
            if (errorDetails.error == 'PERMISSION_DENIED') {
                throw new UserNotFoundException('Unauthorized Role', 'Unauthorized');
            } else if (errorDetails.error == 'VOUCHER_ALREADY_EXIST') {
                throw new ForbiddenException('Voucher already exists', 'Forbidden');
            } else {
                throw new NotFoundException(errorDetails, 'Not found');
            }
        }
    }

    async findAllVouchers(data: FindAllVouchersRequestDTO): Promise<FindAllVouchersResponse> {
        try {
            // console.log(this.iProductService.createProduct(data));
            const findAllVouchersResponse: FindAllVouchersResponse = await firstValueFrom(
                this.iVoucherService.findAllVouchers(data),
            );
            return findAllVouchersResponse;
        } catch (e) {
            // console.log(e)
            const errorDetails = JSON.parse(e.details);
            // console.log(errorDetails);
            throw new NotFoundException(errorDetails, 'Not found');
        }
    }

    async findVoucherById(data: FindVoucherByIdRequestDTO): Promise<VoucherResponse> {
        try {
            // console.log(this.iProductService.createProduct(data));
            const voucherResponse: VoucherResponse = await firstValueFrom(
                this.iVoucherService.findVoucherById(data),
            );
            return voucherResponse;
        } catch (e) {
            // console.log(e)
            const errorDetails = JSON.parse(e.details);
            // console.log(errorDetails);
            if (errorDetails.error == 'PERMISSION_DENIED') {
                throw new UserNotFoundException('Unauthorized Role', 'Unauthorized');
            } else if (errorDetails.error == 'VOUCHER_NOT_FOUND') {
                throw new UserNotFoundException('Voucher not found');
            } else {
                throw new NotFoundException(errorDetails, 'Not found');
            }
        }
    }

    async updateVoucher(data: UpdateVoucherRequestDTO): Promise<VoucherResponse> {
        try {
            // console.log(this.iProductService.createProduct(data));
            const voucherResponse: VoucherResponse = await firstValueFrom(
                this.iVoucherService.updateVoucher(data),
            );
            return voucherResponse;
        } catch (e) {
            // console.log(e)
            const errorDetails = JSON.parse(e.details);
            // console.log(errorDetails);
            if (errorDetails.error == 'PERMISSION_DENIED') {
                throw new UserNotFoundException('Unauthorized Role', 'Unauthorized');
            } else if (errorDetails.error == 'VOUCHER_NOT_FOUND') {
                throw new UserNotFoundException('Voucher not found');
            } else {
                throw new NotFoundException(errorDetails, 'Not found');
            }
        }
    }

    async deleteVoucher(data: DeleteVoucherRequestDTO): Promise<VoucherResponse> {
        try {
            // console.log(this.iProductService.createProduct(data));
            const voucherResponse: VoucherResponse = await firstValueFrom(
                this.iVoucherService.deleteVoucher(data),
            );
            return voucherResponse;
        } catch (e) {
            // console.log(e)
            const errorDetails = JSON.parse(e.details);
            // console.log(errorDetails);
            if (errorDetails.error == 'PERMISSION_DENIED') {
                throw new UserNotFoundException('Unauthorized Role', 'Unauthorized');
            } else if (errorDetails.error == 'VOUCHER_NOT_FOUND') {
                throw new UserNotFoundException('Voucher not found');
            } else {
                throw new NotFoundException(errorDetails, 'Not found');
            }
        }
    }

    async findVoucherByCode(data: FindVoucherByCodeRequestDTO): Promise<VoucherResponse> {
        try {
            // console.log(this.iProductService.createProduct(data));
            const voucherResponse: VoucherResponse = await firstValueFrom(
                this.iVoucherService.checkVoucherByCode(data),
            );
            return voucherResponse;
        } catch (e) {
            // console.log(e)
            const errorDetails = JSON.parse(e.details);
            // console.log(errorDetails);
            if (errorDetails.error == 'PERMISSION_DENIED') {
                throw new UserNotFoundException('Unauthorized Role', 'Unauthorized');
            } else if (errorDetails.error == 'VOUCHER_NOT_FOUND') {
                throw new UserNotFoundException('Voucher not found');
            } else {
                throw new NotFoundException(errorDetails, 'Not found');
            }
        }
    }
}
