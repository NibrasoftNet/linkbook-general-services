/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "shared";

export interface GetUserRequest {
  email: string;
}

export interface GetUserResponse {
  name: string;
  email: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
}

export interface CreateUserResponse {
  name: string;
  email: string;
}

export interface ConfirmEmailRequest {
  otp: string;
  expiryDate: number;
}

export interface ConfirmEmailResponse {
  success: boolean;
}

export const SHARED_PACKAGE_NAME = "shared";

export interface SharedServiceClient {
  getUser(request: GetUserRequest): Observable<GetUserResponse>;

  createUser(request: CreateUserRequest): Observable<CreateUserResponse>;

  confirmEmail(request: ConfirmEmailRequest): Observable<ConfirmEmailResponse>;
}

export interface SharedServiceController {
  getUser(request: GetUserRequest): Promise<GetUserResponse> | Observable<GetUserResponse> | GetUserResponse;

  createUser(
    request: CreateUserRequest,
  ): Promise<CreateUserResponse> | Observable<CreateUserResponse> | CreateUserResponse;

  confirmEmail(
    request: ConfirmEmailRequest,
  ): Promise<ConfirmEmailResponse> | Observable<ConfirmEmailResponse> | ConfirmEmailResponse;
}

export function SharedServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["getUser", "createUser", "confirmEmail"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("SharedService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("SharedService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const SHARED_SERVICE_NAME = "SharedService";
