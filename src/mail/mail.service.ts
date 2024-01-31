import { Injectable } from '@nestjs/common';
import { CreateMailerInput } from './dto/create-mailer.input';
import { UpdateMailerInput } from './dto/update-mailer.input';
import { ISendMailOptions } from '@nestjs-modules/mailer';
import { SentMessageInfo } from 'nodemailer';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfirmEmailRequest, ConfirmEmailResponse } from '../proto/shared';

@Injectable()
export class MailService {
  constructor(
      private readonly mailerService: MailerService,
  ) {}
  async sendEmail(emailData: ConfirmEmailRequest): Promise<ConfirmEmailResponse> {
    const sendingEmailOptions: ISendMailOptions = {
      to: "weavers.top@gmail.com",
      //from: `no-repply ${emailConfig.from} ${emailConfig.from}`,
      subject: 'Email confirmation',
      html:`<h1>OTP Confirmation ${emailData.otp}</h1>`
    };
    //SEND EMAIL WITH HTML USING nest/mail and nodemailer
    const messageSent: SentMessageInfo = await this.mailerService.sendMail(
        sendingEmailOptions,
    );
    return { success: true };
  }
}
