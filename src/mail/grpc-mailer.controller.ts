import { Controller } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { MailService } from './mail.service';
import {
	ConfirmEmailRequest,
	ConfirmEmailResponse,
	CreateUserRequest,
	CreateUserResponse,
	GetUserRequest,
	GetUserResponse,
	SharedServiceController,
} from '../proto/shared';

@Controller('hero')
export class GrpcMailController implements SharedServiceController {
	constructor(private readonly mailerService: MailService) {}
	@GrpcMethod('SharedService', 'GetUser')
	async getUser(data: GetUserRequest): Promise<GetUserResponse> {
		try {
			return { name: data.email, email: data.email };
		} catch (error) {
			throw new RpcException(`Fail to get user ${error}`)
		}
	}

	@GrpcMethod('SharedService', 'CreateUser')
	async createUser(data: CreateUserRequest): Promise<CreateUserResponse> {
		try {
			return { name: data.email, email: data.email };
		} catch (error) {
			throw new RpcException(`Fail to get user ${error}`)
		}
	}

	@GrpcMethod('SharedService', 'ConfirmEmail')
	async confirmEmail(emailData: ConfirmEmailRequest): Promise<ConfirmEmailResponse> {
		try {
			return await this.mailerService.sendEmail(emailData);
		} catch (error) {
			throw new RpcException(`Fail to get user ${error}`)
		}
	}
}
