import { registerAs } from '@nestjs/config';
import { MailerConfig } from './mailer-config.type';
import validateConfig from '../../utils/validate-config';
import { IsBoolean, IsEmail, IsNumber, IsString } from 'class-validator';

class EnvironmentVariablesValidator {
  @IsString()
  SMTP_HOST: string;

  @IsString()
  SMTP_SERVICE: string;

  @IsNumber()
  SMTP_PORT: number;

  @IsBoolean()
  SMTP_IGNORETLS: boolean;

  @IsBoolean()
  SMTP_SECURE: boolean;

  @IsEmail()
  SMTP_USER: string;

  @IsString()
  SMTP_PASS: string;
}

export default registerAs<MailerConfig>('mailer', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);
  return {
    smtpHost: process.env.SMTP_HOST,
    smtpService: process.env.SMTP_SERVICE,
    smtpPort: process.env.SMTP_PORT,
    smtpIgnoreTls: process.env.SMTP_IGNORETLS,
    smtpSecure: process.env.SMTP_SECURE,
    smtpUser: process.env.SMTP_USER,
    smtpPass: process.env.SMTP_PASS
  };
});
