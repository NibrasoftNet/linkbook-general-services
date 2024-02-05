import { AppConfig } from './app-config.type';
import { MailerConfig } from '../mail/config/mailer-config.type';
import { FileConfig } from '../files/config/file-config.type';


export type ServiceConfigType = {
    app: AppConfig;
    mail: MailerConfig;
    file: FileConfig;
};
