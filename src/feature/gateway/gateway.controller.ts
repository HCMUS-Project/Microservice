import {Controller, Req, Res, All, Param, Body, Headers, Query, Post, Get} from '@nestjs/common';
import {Request, Response} from 'express';
import {ConfigService} from '@nestjs/config';
import {HttpService, } from '@nestjs/axios';
import {catchError, first, firstValueFrom, lastValueFrom, take, tap} from 'rxjs';
import axios, {Axios, AxiosHeaders, AxiosResponse} from 'axios';
import got from 'got';

@Controller('api/gateway')
export class GatewayController
{
  private readonly serviceUrls: {[key: string]: string;};

  constructor (
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  )
  {
    this.serviceUrls = {
      auth: this.configService.get<string>('AUTH_SERVICE_URL'),
      users: this.configService.get<string>('USER_SERVICE_URL'),
      // Add more services here
    };
  }

  @Post(':service/*')
  async handleRequest (
    @Param('service') service: string,
    @Req() req: Request,
    @Res() res: Response,
  ) 
  {
    const serviceUrl = this.serviceUrls[service];
    if (!serviceUrl)
    {
      res.status(404).send('Service not found');
      return;
    }
    // console.log(req.headers);
    const path = req.url.substring(`/api/gateway/${ service }`.length + 1);
    const axiosResponse$ = this.httpService.request({
      method: req.method,
      url: `${ serviceUrl }${ path }`,
      data: req.body,
      headers: {
        accept: req.headers['content-type']
      }
    }).pipe(
      catchError(error =>
      {
        // console.error('Error during HTTP request:', error);
        throw error;
      }),
    );
    let axiosResponse: AxiosResponse;
    try
    {
      axiosResponse = await firstValueFrom(axiosResponse$);
    } catch (error)
    {
      // console.error('Error during HTTP request:', error);
      if (error.response)
      {
        // If the error is an HTTP error, send the error response from the service
        res.status(error.response.status).send(error.response.data);
      } else
      {
        // If the error is not an HTTP error, send a generic error message
        res.status(500).send('Error during HTTP request');
      }
      return;
    }
  }

}