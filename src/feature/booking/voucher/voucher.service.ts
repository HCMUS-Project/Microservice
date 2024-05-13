import {
    ForbiddenException,
    Inject,
    Injectable,
    NotFoundException,
    OnModuleInit,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { UserNotFoundException } from 'src/common/exceptions/exceptions';
import { Observable, firstValueFrom } from 'rxjs';
import {
    CreateVoucherRequestDTO,
    DeleteVoucherRequestDTO,
    EditVoucherRequestDTO,
    FindAllVouchersRequestDTO,
    FindOneVoucherRequestDTO,
} from './voucher.dto';
import { CreateVoucherResponse } from 'src/proto_build/booking/voucher/CreateVoucherResponse';
import { EditVoucherResponse } from 'src/proto_build/booking/voucher/EditVoucherResponse';
import { DeleteVoucherResponse } from 'src/proto_build/booking/voucher/DeleteVoucherResponse';
import { FindAllVouchersResponse } from 'src/proto_build/e_commerce/voucher/FindAllVouchersResponse';
import { FindOneVoucherResponse } from 'src/proto_build/booking/voucher/FindOneVoucherResponse';

interface VoucherService {
    createVoucher(data: CreateVoucherRequestDTO): Observable<CreateVoucherResponse>;
    editVoucher(data: EditVoucherRequestDTO): Observable<EditVoucherResponse>;
    deleteVoucher(data: DeleteVoucherRequestDTO): Observable<DeleteVoucherResponse>;
    findAllVouchers(data: FindAllVouchersRequestDTO): Observable<FindAllVouchersResponse>;
    findOneVoucher(data: FindOneVoucherRequestDTO): Observable<FindOneVoucherResponse>;
}

@Injectable()
export class BookingVoucherService implements OnModuleInit {
    private iVoucherService: VoucherService;

    constructor(@Inject('GRPC_ECOMMERCE_BOOKING') private client: ClientGrpc) {}

    onModuleInit() {
        this.iVoucherService = this.client.getService<VoucherService>('VoucherService');
        // console.log(this.iProductService)
    }

    async createVoucher(data: CreateVoucherRequestDTO): Promise<CreateVoucherResponse> {
        try {
            // console.log(this.iProductService.createProduct(data));
            const createVoucherResponse: CreateVoucherResponse = await firstValueFrom(
                this.iVoucherService.createVoucher(data),
            );
            return createVoucherResponse;
        } catch (e) {
            // console.log(e)
            const errorDetails = JSON.parse(e.details);
            // console.log(errorDetails);
            if (errorDetails.error == 'PERMISSION_DENIED') {
                throw new UserNotFoundException('Unauthorized Role', 'Unauthorized');
            } else if (errorDetails.error == 'PRODUCT_ALREADY_EXISTS') {
                throw new ForbiddenException('Product already exists', 'Forbidden');
            } else {
                throw new NotFoundException(errorDetails, 'Not found');
            }
        }
    }

    async editVoucher(data: EditVoucherRequestDTO): Promise<EditVoucherResponse> {
        try {
            // console.log(this.iProductService.createProduct(data));
            const editVoucherResponse: EditVoucherResponse = await firstValueFrom(
                this.iVoucherService.editVoucher(data),
            );
            return editVoucherResponse;
        } catch (e) {
            // console.log(e)
            const errorDetails = JSON.parse(e.details);
            // console.log(errorDetails);
            if (errorDetails.error == 'PERMISSION_DENIED') {
                throw new UserNotFoundException('Unauthorized Role', 'Unauthorized');
            } else if (errorDetails.error == 'PRODUCT_ALREADY_EXISTS') {
                throw new ForbiddenException('Product already exists', 'Forbidden');
            } else {
                throw new NotFoundException(errorDetails, 'Not found');
            }
        }
    }

    async deleteVoucher(data: DeleteVoucherRequestDTO): Promise<DeleteVoucherResponse> {
        try {
            // console.log(this.iProductService.createProduct(data));
            const deleteVoucherResponse: DeleteVoucherResponse = await firstValueFrom(
                this.iVoucherService.deleteVoucher(data),
            );
            return deleteVoucherResponse;
        } catch (e) {
            // console.log(e)
            const errorDetails = JSON.parse(e.details);
            // console.log(errorDetails);
            if (errorDetails.error == 'PERMISSION_DENIED') {
                throw new UserNotFoundException('Unauthorized Role', 'Unauthorized');
            } else if (errorDetails.error == 'PRODUCT_ALREADY_EXISTS') {
                throw new ForbiddenException('Product already exists', 'Forbidden');
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
            if (errorDetails.error == 'PERMISSION_DENIED') {
                throw new UserNotFoundException('Unauthorized Role', 'Unauthorized');
            } else if (errorDetails.error == 'PRODUCT_ALREADY_EXISTS') {
                throw new ForbiddenException('Product already exists', 'Forbidden');
            } else {
                throw new NotFoundException(errorDetails, 'Not found');
            }
        }
    }

    async findOneVoucher(data: FindOneVoucherRequestDTO): Promise<FindOneVoucherResponse> {
        try {
            // console.log(this.iProductService.createProduct(data));
            const findOneVoucherResponse: FindOneVoucherResponse = await firstValueFrom(
                this.iVoucherService.findOneVoucher(data),
            );
            return findOneVoucherResponse;
        } catch (e) {
            // console.log(e)
            const errorDetails = JSON.parse(e.details);
            // console.log(errorDetails);
            if (errorDetails.error == 'PERMISSION_DENIED') {
                throw new UserNotFoundException('Unauthorized Role', 'Unauthorized');
            } else if (errorDetails.error == 'PRODUCT_ALREADY_EXISTS') {
                throw new ForbiddenException('Product already exists', 'Forbidden');
            } else {
                throw new NotFoundException(errorDetails, 'Not found');
            }
        }
    }
}