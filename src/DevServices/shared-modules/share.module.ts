import { Module } from '@nestjs/common';
import { HashService } from './encript/encript.service';

const providers = [HashService];

@Module({
  providers,
  exports: [...providers],
})
export class EncriptModule {}
