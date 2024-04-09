// import {Controller, Req, Res, All, Param, Body, Headers, Query, Post, Get} from '@nestjs/common';
// import {Request, Response} from 'express';
// import {ConfigService} from '@nestjs/config';
// import {HttpService, } from '@nestjs/axios';
// import {catchError, first, firstValueFrom, lastValueFrom, take, tap} from 'rxjs';
// import { Client, ClientGrpc, Transport } from '@nestjs/microservices';
// import axios, {Axios, AxiosHeaders, AxiosResponse} from 'axios';
// import got from 'got';

// @Controller('api/gateway')
// export class GatewayController
// {
//   private readonly serviceUrls: {[key: string]: string;};

//   constructor (
//     private readonly httpService: HttpService,
//     private readonly configService: ConfigService,
//   )
//   {
//     this.serviceUrls = {
//       auth: this.configService.get<string>('AUTH_SERVICE_URL'),
//       users: this.configService.get<string>('USER_SERVICE_URL'),
//       // Add more services here
//     };
//   }

//   @All(':service/*')
//   async handleRequest (
//     @Param('service') service: string,
//     @Req() req: Request,
//     @Res() res: Response,
//   )
//   {
//     const serviceUrl = this.serviceUrls[service];
//     if (!serviceUrl)
//     {
//       res.status(404).send('Service not found');
//       return;
//     }
//     // console.log(req.headers, req.body);
//     const path = req.url.substring(`/api/gateway/${ service }`.length + 1);
//     const axiosResponse$ = this.httpService.request({
//       method: req.method,
//       url: `${ serviceUrl }${ path }`,
//       data: req.body,
//       headers: {
//         accept: req.headers['content-type'],
//         authorization: req.headers['authorization'] ? req.headers['authorization'] : undefined
//       }
//     }).pipe(
//       catchError(error =>
//       {
//         console.error('Error during HTTP request:', error);
//         throw error;
//       }),
//     );
//     // let axiosResponse: AxiosResponse;
//     try
//     {
//       const axiosResponse = await firstValueFrom(axiosResponse$);
//       // console.log(axiosResponse)
//       res.send(axiosResponse.data);
//       return axiosResponse.data;
//     } catch (error)
//     {
//       console.error('Error during HTTP request:', error);
//       if (error.response)
//       {
//         // If the error is an HTTP error, send the error response from the service
//         // console.log('error');
//         res.status(error.response.status).send(error.response.data);
//         // console.log('error')
//       } else
//       {
//         // If the error is not an HTTP error, send a generic error message
//         // console.log('error 500');
//         res.status(500).send('Error during HTTP request');
//       }
//       return;
//     }
//   }

// }

import { Controller, Req, Res, All, Param, Inject } from '@nestjs/common';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { ClientGrpc } from '@nestjs/microservices';
import {
    SignInRequest,
    SignUpRequest,
    SignInResponse,
    SignOutRequest,
    SignUpResponse,
    SignOutResponse,
    AuthService,
    RefreshTokensRequest,
} from '../proto-ts/auth';

@Controller('api/gateway')
export class GatewayController {
    private readonly serviceUrls: { [key: string]: string };
    private authClient: AuthService;

    constructor(
        private readonly configService: ConfigService,
        @Inject('AuthService') private readonly grpcClient: ClientGrpc,
    ) {
        this.serviceUrls = {
            auth: this.configService.get<string>('AUTH_SERVICE_URL'),
            users: this.configService.get<string>('USER_SERVICE_URL'),
            // Add more services here
        };
        this.authClient = this.grpcClient.getService<AuthService>('AuthService');
    }

    @All(':service/:method')
    async handleRequest(
        @Param('service') service: string,
        @Param('method') method: string,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        let responseSent = false; // Flag to track if response has been sent
        try {
            let grpcResponse: any;

            if (service === 'auth') {
                if (method === 'sign-in') {
                    const signInRequest: SignInRequest = {
                        email: req.body.email,
                        password: req.body.password,
                        device: req.body.device,
                    };
                    grpcResponse = await this.authClient.signIn(signInRequest);
                } else if (method === 'sign-out') {
                    const signOutRequest: SignOutRequest = {
                        token: req.body.token,
                    };
                    grpcResponse = await this.authClient.signOut(signOutRequest);
                } else if (method === 'refresh-tokens') {
                    const refreshTokensRequest: RefreshTokensRequest = {
                        refreshToken: req.body.refreshToken,
                    };
                    grpcResponse = await this.authClient.refreshTokens(refreshTokensRequest);
                } else {
                    res.status(404).send('Method not found');
                    responseSent = true;
                    return;
                }
            } else {
                res.status(404).send('Service not found');
                responseSent = true;
                return;
            } 
            res.send(grpcResponse);
            responseSent = true; // Set flag to true after sending response
        } catch (error) {
            console.error('Error during gRPC request:', error);
            if (!responseSent) {
                // Only send error response if no response has been sent yet
                res.status(500).send('Error during gRPC request');
            }
        }
    }
}
