import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';
import { readFile } from 'fs/promises';

@Controller('.well-known')
export class WellKnownController {
  @Get('assetlinks.json')
  async getAssetLinks(@Res() res: Response) {
    const filePath = join(__dirname, '..', '..', 'public', '.well-known', 'assetlinks.json');
    const file = await readFile(filePath, 'utf8');
    console.log(filePath)
    res.type('json').send(file);
  }

  @Get('apple-app-site-association')
  async getAppleAppSiteAssociation(@Res() res: Response) {
    const filePath = join(__dirname, '..', '..', 'public', '.well-known', 'apple-app-site-association');
    const file = await readFile(filePath, 'utf8');
    res.type('json').send(file);
  }
}
