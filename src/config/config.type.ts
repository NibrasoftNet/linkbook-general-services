import { AppConfig } from './app-config.type';
import { MailerConfig } from '../mail/config/mailer-config.type';


export type ServiceConfigType = {
    app: AppConfig;
    mail: MailerConfig;
};
