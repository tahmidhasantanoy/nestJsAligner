/* You have to be finished it within today. */

import { HttpService } from '@nestjs/axios';
import { BadGatewayException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosRequestConfig } from 'axios';
import { catchError, firstValueFrom, retry, timeout } from 'rxjs';

export interface ApiRequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, any>;
  timeout?: number;
  retries?: number;
  serviceName?: string;
}

@Injectable()
export class HttpClientService {
  private readonly httpLogger = new Logger(HttpClientService.name);

  constructor(
    protected readonly httpService: HttpService,
    protected readonly configService: ConfigService,
  ) {}

  async request<T = any>(
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    url: string,
    data?: any,
    options: ApiRequestOptions = {},
  ): Promise<T> {
    const {
      retries = 3,
      timeout: requestTimeout = 30000,
      ...otherOptions
    } = options;

    const config: AxiosRequestConfig = {
      method,
      url,
      data,
      headers: otherOptions.headers || {},
      params: otherOptions.params || {},
      timeout: requestTimeout,
    };

    try {
      this.httpLogger.log(`Making ${method} request to ${url}`);

      const response = await firstValueFrom(
        this.httpService.request<T>(config).pipe(
          timeout(requestTimeout),
          retry(retries),
          catchError((error) => {
            this.httpLogger.error(
              `${method} request to ${url} failed: ${error.message}`,
            );
            throw error;
          }),
        ),
      );

      this.httpLogger.log(`${method} request to ${url} completed successfully`);
      return response.data;
    } catch (error) {
      this.httpLogger.error(`${method} request to ${url} failed`, error);
      this.httpLogger.error(`Final error for ${method} ${url}:`, error.message);
      throw new BadGatewayException(
        `${options.serviceName} service failed due to : ${error?.response?.data?.message ?? error.message}`,
      );
    }
  }

  async get<T = any>(url: string, options?: ApiRequestOptions): Promise<T> {
    return this.request<T>('GET', url, undefined, options);
  }

  async post<T = any>(
    url: string,
    data?: any,
    options?: ApiRequestOptions,
  ): Promise<T> {
    return this.request<T>('POST', url, data, options);
  }

  async put<T = any>(
    url: string,
    data?: any,
    options?: ApiRequestOptions,
  ): Promise<T> {
    return this.request<T>('PUT', url, data, options);
  }

  async patch<T = any>(
    url: string,
    data?: any,
    options?: ApiRequestOptions,
  ): Promise<T> {
    return this.request<T>('PATCH', url, data, options);
  }

  async delete<T = any>(url: string, options?: ApiRequestOptions): Promise<T> {
    return this.request<T>('DELETE', url, undefined, options);
  }
}
