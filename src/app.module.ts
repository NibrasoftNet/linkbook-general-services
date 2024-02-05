import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailModule } from './mail/mail.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { ServiceConfigType } from './config/config.type';
import { FilesModule } from './files/files.module';
import fileConfig from './files/config/file.config';
import mailerConfig from './mail/config/mailer.config';
import appConfig from './config/app.config';

@Module({
  imports: [
    ConfigModule.forRoot({
    isGlobal: true,
    load: [appConfig, mailerConfig, fileConfig],
    envFilePath: ['.env'],
    }),
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<ServiceConfigType>) => ({
        transport: {
          host: configService.getOrThrow<string>('SMTP_HOST', { infer: true }),
          service: configService.getOrThrow<string>('SMTP_SERVICE', { infer: true }),
          port: configService.getOrThrow<number>('SMTP_PORT', { infer: true }),
          ignoreTLS: configService.getOrThrow<boolean>('SMTP_IGNORETLS', { infer: true }),
          secure: configService.getOrThrow<boolean>('SMTP_SECURE', { infer: true }),
          auth: {
            user: configService.getOrThrow<string>('SMTP_USER', { infer: true }),
            pass: configService.getOrThrow<string>('SMTP_PASS', { infer: true }),
          },
        },
        defaults: {
          from: '"No Reply" <weavers.top@gmail.com>',
        },
        //preview: true,
        template: {
          dir: process.cwd() + '/template/',
          adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
          options: {
            strict: true,
          },
        },
      }),
    }), MailModule, FilesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
