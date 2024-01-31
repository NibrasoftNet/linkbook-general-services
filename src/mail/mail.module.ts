import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailResolver } from './mail.resolver';
import { GrpcMailController } from './grpc-mailer.controller';

@Module({
  imports:[],
  controllers: [GrpcMailController],
  providers: [MailResolver, MailService],
})
export class MailModule {}
