import { Module } from '@nestjs/common';
import { GatewayService } from './gateway.service';
import { GatewayController } from './gateway.controller';
import {ConfigService} from '@nestjs/config';
import {HttpModule, HttpService} from '@nestjs/axios';

@Module({
  imports:[HttpModule],
  controllers: [GatewayController],
  providers: [GatewayService],
})
export class GatewayModule {}
