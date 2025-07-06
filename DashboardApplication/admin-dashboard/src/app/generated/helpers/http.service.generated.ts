/**
 * @fileoverview
 * ⚠️ WARNING: This file is auto-generated. ⚠️
 *
 * Any manual changes to this file will be overwritten when the code is regenerated.
 * If you need to modify the API functionality, please:
 * 1. Modify the API generator templates
 * 2. Re-run the code generation process
 *
 * Last generated: 2025-05-16T11:05:38.652Z
 * Generator version: 1.0.0
 *
 * @description
 * Base API service that provides generic HTTP functionality with built-in:
 * - Request caching for GET requests
 * - Automatic retry with exponential backoff
 * - Configurable request timeouts
 * - Error handling and logging
 * - Support for all standard HTTP methods (GET, POST, PUT, PATCH, DELETE)
 * - Parameter handling and URL generation
 * - Batch request processing
 *
 * @example
 * ```typescript
 * @Injectable()
 * export class UserApiService extends ApiServiceGeneric {
 *   constructor(http: HttpClient) {
 *     super(http);
 *   }
 *
 *   getUser(id: string): Observable<HttpResponse<User>> {
 *     return this.get<User>('users', [id]);
 *   }
 * }
 * ```
 *
 * @see {@link HttpHelper} for URL generation and header management
 * @see {@link RequestOptions} for available request configuration options
 * @generated
 */

import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, first, Observable, throwError, timeout, retry, timer } from "rxjs";
import { HttpHelper } from "./helper.generated";
import { CacheableData, RequestOptions } from "./interface.generated";
import { HttpAuthService } from "./http-auto.service.generated";

/**
 * Configuration options for API requests
 * @interface RequestOptions
 * @property {boolean} [cache=true] - Enable/disable response caching (GET requests only)
 * @property {number} [timeout=30000] - Request timeout in milliseconds
 * @property {number} [retries=3] - Number of retry attempts for failed requests
 */
const DEFAULT_OPTIONS: RequestOptions = {
	cache: true,
	timeout: 30000,
	retries: 3
};

/**
 * Abstract base class for API services providing common HTTP functionality
 * with built-in caching, retry logic, and error handling.
 *
 * @abstract
 * @class ApiServiceGeneric
 * @template T - The type of data being transferred
 *
 * @example
 * ```typescript
 * // Making a cached GET request
 * this.get<User[]>('users', [], { cache: true });
 *
 * // Making a POST request with retry
 * this.post<User>('users', newUser, [], { retries: 3 });
 *
 * // Making a PUT request with custom timeout
 * this.put<User>('users', updatedUser, [userId], { timeout: 5000 });
 * ```
 */
@Injectable()
export abstract class HttpServiceGeneric {

	/** In-memory cache for storing HTTP responses */
	private cache = new Map<string, Observable<HttpResponse<unknown>>>();

	constructor(protected http: HttpClient, protected authService: HttpAuthService) { }

	/**
	 * Gets the default headers for all API requests
	 * @returns {HttpHeaders} The headers to be included in each request
	 */
	protected getHeaders(): HttpHeaders {
		const baseHeaders = HttpHelper.apiServiceAccess.getHeader();
		const authHeaders = this.authService.getAuthHeaders();
		return baseHeaders.append('Authorization', authHeaders.get('Authorization') || '');
	}

	/**
	 * Generates a full API URL by combining the base URL with parameters
	 * @param {string} url - The base URL path
	 * @param {string[]} [parameters] - Optional URL parameters to append
	 * @returns {string} The complete API URL
	 */
	protected generateApiUrl(url: string, parameters?: string[]): string {
		return HttpHelper.apiServiceAccess.generateUrl(url, parameters);
	}

	/**
	 * Handles common request processing including timeout, retry, and error handling
	 * @template T The expected response type
	 * @param {Observable<HttpResponse<T>>} request - The HTTP request observable
	 * @param {RequestOptions} options - Request configuration options
	 * @returns {Observable<HttpResponse<T>>} The processed HTTP response observable
	 */
	private handleRequest<T>(request: Observable<HttpResponse<T>>, options: RequestOptions): Observable<HttpResponse<T>> {
		return request.pipe(
			timeout(options.timeout || 300000),
			retry({
				count: options.retries,
				delay: (error, retryCount) => {
					console.warn(`Retrying failed request (${retryCount}/${options.retries})`, error);
					return timer(Math.pow(2, retryCount) * 1000); // Exponential backoff
				}
			}),
			first(),
			catchError(error => {
				if (error.name === 'TimeoutError') {
					return throwError(() => new Error(`Request timed out after ${options.timeout}ms`));
				}

				return HttpHelper.apiServiceAccess.handleError<HttpResponse<T>>()(error);
			})
		);
	}

	/**
	 * Generates a unique cache key for request caching
	 * @param {string} method - The HTTP method
	 * @param {string} url - The request URL
	 * @param {unknown} [data] - Optional request data
	 * @returns {string} A unique cache key
	 */
	private getCacheKey(method: string, url: string, data?: unknown): string {
		const cacheData: CacheableData = { method, url, data };
		return JSON.stringify(cacheData);
	}

	/**
	 * Performs a GET request with optional caching
	 * @template Request The expected response type
	 * @param {string} url - The API endpoint URL
	 * @param {string[]} [parameters] - Optional URL parameters
	 * @param {RequestOptions} [options] - Request configuration options
	 * @returns {Observable<HttpResponse<Request>>} The HTTP response observable
	 */
	public get<Response>(url: string, parameters?: string[], options: RequestOptions = DEFAULT_OPTIONS): Observable<HttpResponse<Response>> {
		const apiURL = this.generateApiUrl(url, parameters);
		const cacheKey = this.getCacheKey('GET', apiURL);

		if (options.cache && this.cache.has(cacheKey)) {
			return this.cache.get(cacheKey) as Observable<HttpResponse<Response>>;
		}

		const request = this.http.get<Response>(apiURL, { headers: this.getHeaders(), observe: 'response' });
		const response = this.handleRequest(request, options);

		if (options.cache) {
			this.cache.set(cacheKey, response as Observable<HttpResponse<Response>>);
		}

		return response;
	}

	/**
	 * Performs a POST request
	 * @template Request The expected response type
	 * @param {string} url - The API endpoint URL
	 * @param {Request} [data] - The request payload
	 * @param {string[]} [parameters] - Optional URL parameters
	 * @param {RequestOptions} [options] - Request configuration options
	 * @returns {Observable<HttpResponse<Request>>} The HTTP response observable
	 */
	public post<Request, Response>(url: string, data?: Request, parameters?: string[], options: RequestOptions = DEFAULT_OPTIONS): Observable<HttpResponse<Response>> {
		const apiURL = this.generateApiUrl(url, parameters);
		return this.handleRequest(
			this.http.post<Response>(apiURL, data, {
				headers: this.getHeaders(),
				observe: 'response'
			}),
			options
		);
	}

	/**
	 * Performs a PUT request
	 * @template Request The expected response type
	 * @param {string} url - The API endpoint URL
	 * @param {Request} [data] - The request payload
	 * @param {string[]} [parameters] - Optional URL parameters
	 * @param {RequestOptions} [options] - Request configuration options
	 * @returns {Observable<HttpResponse<Request>>} The HTTP response observable
	 */
	public put<Request, Response>(url: string, data?: Request, parameters?: string[], options: RequestOptions = DEFAULT_OPTIONS): Observable<HttpResponse<Response>> {
		const apiURL = this.generateApiUrl(url, parameters);
		return this.handleRequest(
			this.http.put<Response>(apiURL, data, {
				headers: this.getHeaders(),
				observe: 'response'
			}),
			options
		);
	}

	/**
	 * Performs a PATCH request
	 * @template Request The expected response type
	 * @param {string} url - The API endpoint URL
	 * @param {Request} [data] - The request payload
	 * @param {string[]} [parameters] - Optional URL parameters
	 * @param {RequestOptions} [options] - Request configuration options
	 * @returns {Observable<HttpResponse<Request>>} The HTTP response observable
	 */
	public patch<Request, Response>(url: string, data?: Request, parameters?: string[], options: RequestOptions = DEFAULT_OPTIONS): Observable<HttpResponse<Response>> {
		const apiURL = this.generateApiUrl(url, parameters);
		return this.handleRequest(
			this.http.patch<Response>(apiURL, data, {
				headers: this.getHeaders(),
				observe: 'response'
			}),
			options
		);
	}

	/**
	 * Performs a DELETE request
	 * @template Request The expected response type
	 * @param {string} url - The API endpoint URL
	 * @param {string[]} [parameters] - Optional URL parameters
	 * @param {RequestOptions} [options] - Request configuration options
	 * @returns {Observable<HttpResponse<Request>>} The HTTP response observable
	 */
	public delete<Response>(url: string, parameters?: string[], options: RequestOptions = DEFAULT_OPTIONS): Observable<HttpResponse<Response>> {
		const apiURL = this.generateApiUrl(url, parameters);
		return this.handleRequest(
			this.http.delete<Response>(apiURL, {
				headers: this.getHeaders(),
				observe: 'response'
			}),
			options
		);
	}

	/**
	 * Clears the request cache
	 */
	public clearCache(): void {
		this.cache.clear();
	}

	/**
	 * Executes multiple promises in parallel and handles errors
	 * @template T The expected result type
	 * @param {Promise<T>[]} promises - Array of promises to execute
	 * @returns {Promise<T[]>} Promise that resolves with all results
	 * @throws {Error} If any promise fails
	 */
	public async batchPromise<T>(promises: Promise<T>[]): Promise<T[]> {
		return Promise.all(promises).catch((error) => {
			console.error('Batch operation failed:', error);
			throw error;
		});
	}
}
