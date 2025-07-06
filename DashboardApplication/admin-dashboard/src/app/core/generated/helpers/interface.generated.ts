/**
 * @fileoverview
 * ⚠️ WARNING: This file is auto-generated. ⚠️
 *
 * Any manual changes to this file will be overwritten when the code is regenerated.
 * If you need to modify the API functionality, please:
 * 1. Modify the API generator templates
 * 2. Re-run the code generation process
 *
 * Last generated: 2025-07-02T20:54:56.168Z
 * Generator version: 1.0.0
 *
 * @description
 * Contains interface definitions for the API service:
 * - Error handling types
 * - Request configuration options
 * - Cache management types
 *
 * @see {@link ApiServiceGeneric} for implementation details
 * @generated
 */

import { HttpErrorResponse } from "@angular/common/http";

/**
 * Represents a custom error event structure returned by the API
 *
 * @interface CustomErrorEvent
 * @property {string} detail - Detailed error message or description
 * @property {string} title - Short error title or category
 * @property {string} instance - Resource instance that caused the error
 * @property {number} status - HTTP status code associated with the error
 *
 * @example
 * ```typescript
 * const error: CustomErrorEvent = {
 *   detail: "User not found in database",
 *   title: "Not Found",
 *   instance: "/api/users/123",
 *   status: 404
 * };
 * ```
 */
export interface CustomErrorEvent extends HttpErrorResponse {
	detail: string;
	title: string;
	instance: string;
	status: number;
}

/**
 * Configuration options for API requests
 *
 * @interface RequestOptions
 * @property {number} [timeout=30000] - Request timeout in milliseconds
 * @property {boolean} [cache=true] - Enable response caching for GET requests
 * @property {number} [retries=3] - Number of retry attempts for failed requests
 *
 * @example
 * ```typescript
 * const options: RequestOptions = {
 *   timeout: 5000,    // 5 second timeout
 *   cache: true,      // Enable caching
 *   retries: 2        // Retry twice on failure
 * };
 * ```
 */
export interface RequestOptions {
	timeout?: number;
	cache?: boolean;
	retries?: number;
}

/**
 * Structure for generating cache keys from request data
 *
 * @interface CacheableData
 * @property {string} method - HTTP method (GET, POST, etc.)
 * @property {string} url - Complete request URL
 * @property {unknown} [data] - Optional request payload
 *
 * @example
 * ```typescript
 * const cacheData: CacheableData = {
 *   method: "GET",
 *   url: "/api/users",
 *   data: { id: 123 }
 * };
 * ```
 */
export interface CacheableData {
	method: string;
	url: string;
	data?: unknown;
}

/**
 * Authentication configuration for API requests
 *
 * @interface AuthConfig
 * @property {AuthType} type - Type of authentication to use
 * @property {string} [credentials] - Base64 encoded credentials for Basic auth
 * @property {string} [token] - JWT or other token for Bearer auth
 * @property {string} [customHeader] - Custom authorization header value
 *
 * @example
 * ```typescript
 * // Basic Auth
 * const basicAuth: AuthConfig = {
 *   type: AuthType.Basic,
 *   credentials: "username:password"
 * };
 *
 * // Bearer Token
 * const bearerAuth: AuthConfig = {
 *   type: AuthType.Bearer,
 *   token: "eyJhbGciOiJIUzI1NiIs..."
 * };
 *
 * // Custom Auth
 * const customAuth: AuthConfig = {
 *   type: AuthType.Custom,
 *   customHeader: "Custom xyz123"
 * };
 * ```
 */
export interface AuthConfig {
	type: AuthType;
	credentials?: string;
	token?: string;
	customHeader?: string;
}

/**
 * Standard response wrapper for HTTP API calls
 *
 * @interface BaseHttpResponse<T>
 * @template T - The type of data contained in the response
 *
 * @property {boolean} status - Indicates whether the request was successful
 * @property {string} [message] - Optional message providing additional context or error description
 * @property {number} [totalCount] - Optional total count of items (used in paginated results)
 * @property {number} [errorCode] - Optional application-specific error code
 * @property {T} [data] - Optional payload of type T containing the response data
 *
 * @example
 * ```ts
 * // Success response with data
 * const response: BaseHttpResponse<User> = {
 *   status: true,
 *   message: "User retrieved successfully",
 *   data: { id: 1, name: "John Doe" }
 * };
 *
 * // Error response without data
 * const error: BaseHttpResponse<void> = {
 *   status: false,
 *   message: "User not found",
 *   errorCode: 404
 * };
 * ```
 */
export interface BaseHttpResponse<T> {
  status: boolean;
  message?: string;
  totalCount?: number;
  errorCode?: number;
  data?: T;
}

/**
 * Type definition for custom HTTP headers
 * Allows string, string array, number, or number array values
 *
 * @type {Record<string, string | string[] | number | number[]>}
 * @property {string} key - Header name (e.g., 'Content-Type', 'X-Custom-Header')
 * @property {string | string[] | number | number[]} value - Header value or array of values
 *
 * @example
 * ```typescript
 * // Single value headers
 * const headers: CustomHeaders = {
 *   'X-API-Version': '1.0',
 *   'X-Request-ID': 12345
 * };
 *
 * // Multiple value headers
 * const headers: CustomHeaders = {
 *   'Accept': ['application/json', 'text/plain'],
 *   'X-Allowed-Ports': [80, 443]
 * };
 * ```
 */
export type CustomHeaders = Record<string, string | string[] | number | number[]>;

/**
 * Supported authentication types for API requests
 *
 * @enum {string}
 * @property {string} None - No authentication
 * @property {string} Basic - Basic authentication (username:password)
 * @property {string} Bearer - Bearer token authentication (JWT)
 * @property {string} Custom - Custom authentication header
 *
 * @example
 * ```typescript
 * // Using enum values
 * const authType = AuthType.Bearer;
 *
 * // Checking auth type
 * if (config.type === AuthType.Basic) {
 *   // Handle Basic auth
 * }
 * ```
 */
export enum AuthType {
	None = 'None',
	Basic = 'Basic',
	Bearer = 'Bearer',
	Custom = 'Custom'
}
