/*!
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/// <reference types="node" />
import { GrpcService } from './common-grpc/service';
import { PreciseDate } from '@google-cloud/precise-date';
import { GoogleAuth, GoogleAuthOptions } from 'google-auth-library';
import { common as p } from 'protobufjs';
import { Float, Int, Numeric, Struct } from './codec';
import { Backup } from './backup';
import { Database } from './database';
import { Instance, CreateInstanceCallback, CreateInstanceResponse } from './instance';
import { grpc, GrpcClientOptions, CallOptions } from 'google-gax';
import { google as instanceAdmin } from '../protos/protos';
import { PagedOptions, PagedResponse, PagedCallback, PagedOptionsWithFilter, NormalCallback } from './common';
import { Session } from './session';
import { SessionPool } from './session-pool';
import { Table } from './table';
import { PartitionedDml, Snapshot, Transaction } from './transaction';
import * as v1 from './v1';
export declare type IOperation = instanceAdmin.longrunning.IOperation;
export declare type GetInstancesOptions = PagedOptionsWithFilter;
export declare type GetInstancesResponse = PagedResponse<Instance, instanceAdmin.spanner.admin.instance.v1.IListInstancesResponse>;
export declare type GetInstancesCallback = PagedCallback<Instance, instanceAdmin.spanner.admin.instance.v1.IListInstancesResponse>;
export declare type GetInstanceConfigsOptions = PagedOptions;
export declare type GetInstanceConfigsResponse = PagedResponse<instanceAdmin.spanner.admin.instance.v1.IInstanceConfig, instanceAdmin.spanner.admin.instance.v1.IListInstanceConfigsResponse>;
export declare type GetInstanceConfigsCallback = PagedCallback<instanceAdmin.spanner.admin.instance.v1.IInstanceConfig, instanceAdmin.spanner.admin.instance.v1.IListInstanceConfigsResponse>;
export interface GetInstanceConfigOptions {
    gaxOptions?: CallOptions;
}
export declare type GetInstanceConfigResponse = [IInstanceConfig];
export declare type GetInstanceConfigCallback = NormalCallback<IInstanceConfig>;
export interface SpannerOptions extends GrpcClientOptions {
    apiEndpoint?: string;
    servicePath?: string;
    port?: number;
    sslCreds?: grpc.ChannelCredentials;
}
export interface RequestConfig {
    client: string;
    method: string;
    reqOpts: any;
    gaxOpts?: CallOptions;
    headers: {
        [k: string]: string;
    };
}
export interface CreateInstanceRequest {
    config?: string;
    nodes?: number;
    processingUnits?: number;
    displayName?: string;
    labels?: {
        [k: string]: string;
    } | null;
    gaxOptions?: CallOptions;
}
/**
 * Translates enum values to string keys.
 *
 * @param E enum type.
 */
export declare type EnumKey<E extends {
    [index: string]: unknown;
}> = keyof E;
/**
 * Translates an enum property of an object from enum value to enum key, leaving
 * all other properties as-is.
 *
 * @param T type containing properties to translate.
 * @param U name of the enum property.
 * @param E enum type to translate.
 */
export declare type TranslateEnumKeys<T, U extends keyof T, E extends {
    [index: string]: unknown;
}> = {
    [P in keyof T]: P extends U ? EnumKey<E> | null | undefined : T[P];
};
/**
 * [Cloud Spanner](https://cloud.google.com/spanner) is a highly scalable,
 * transactional, managed, NewSQL database service. Cloud Spanner solves the
 * need for a horizontally-scaling database with consistent global transaction
 * and SQL semantics. With Cloud Spanner you don't need to choose between
 * consistency and horizontal scaling — you get both.
 *
 * @class
 *
 * @see [Cloud Spanner Documentation](https://cloud.google.com/spanner/docs)
 * @see [Cloud Spanner Concepts](https://cloud.google.com/spanner/docs/concepts)
 *
 * @example Install the client library with <a
 * href="https://www.npmjs.com/">npm</a>:
 * ```
 * npm install --save @google-cloud/spanner
 * ```
 *
 * @example Create a client that uses <a
 * href="https://cloud.google.com/docs/authentication/production#providing_credentials_to_your_application">Application
 * Default Credentials (ADC)</a>:
 * ```
 * const client = new Spanner();
 * ```
 *
 * @example Create a client with <a
 * href="https://cloud.google.com/docs/authentication/production#obtaining_and_providing_service_account_credentials_manually">explicit
 * credentials</a>:
 * ```
 * const client = new Spanner({ projectId:
 * 'your-project-id', keyFilename: '/path/to/keyfile.json'
 * });
 * ```
 *
 * @example <caption>include:samples/quickstart.js</caption>
 * region_tag:spanner_quickstart
 * Full quickstart example:
 *
 * @param {ClientConfig} [options] Configuration options.
 */
declare class Spanner extends GrpcService {
    options: GoogleAuthOptions;
    auth: GoogleAuth;
    clients_: Map<string, {}>;
    instances_: Map<string, Instance>;
    projectIdReplaced_: boolean;
    projectFormattedName_: string;
    resourceHeader_: {
        [k: string]: string;
    };
    /**
     * Placeholder used to auto populate a column with the commit timestamp.
     * This can only be used for timestamp columns that have set the option
     * "(allow_commit_timestamp=true)" in the schema.
     *
     * @type {string}
     */
    static COMMIT_TIMESTAMP: string;
    /**
     * Gets the configured Spanner emulator host from an environment variable.
     */
    static getSpannerEmulatorHost(): {
        endpoint: string;
        port?: number;
    } | undefined;
    constructor(options?: SpannerOptions);
    /** Closes this Spanner client and cleans up all resources used by it. */
    close(): void;
    /**
     * Config for the new instance.
     *
     * @typedef {object} CreateInstanceRequest
     * @property {string} config The name of the instance's configuration.
     * @property {number} [nodes=1] The number of nodes allocated to this instance.
     *     Defaults to 1.
     * @property {Object.<string, string>} [labels] Labels are a flexible and
     *     lightweight mechanism for organizing cloud resources into groups that
     *     reflect a customer's organizational needs and deployment strategies.
     *     Cloud Labels can be used to filter collections of resources. They can
     *     be used to control how resource metrics are aggregated. And they can
     *     be used as arguments to policy management rules (e.g. route,
     *     firewall, load balancing, etc.).
     * @property {string} [displayName] The descriptive name for this instance
     *     as it appears in UIs. Must be unique per project and between 4 and 30
     *     characters in length.
     *     Defaults to the instance unique identifier '<instance>' of the full
     *     instance name of the form 'projects/<project>/instances/<instance>'.
     */
    /**
     * @typedef {array} CreateInstanceResponse
     * @property {Instance} 0 The new {@link Instance}.
     * @property {google.longrunning.Operation} 1 An operation object that can be used to check
     *     the status of the request.
     * @property {google.longrunning.IOperation} 2 The full API response.
     */
    /**
     * @callback CreateInstanceCallback
     * @param {?Error} err Request error, if any.
     * @param {Instance} instance The new {@link Instance}.
     * @param {google.longrunning.Operation} operation An operation object that can be used to
     *     check the status of the request.
     * @param {google.longrunning.IOperation} apiResponse The full API response.
     */
    /**
     * Create an instance.
     *
     * Wrapper around {@link v1.InstanceAdminClient#createInstance}.
     *
     * @see {@link v1.InstanceAdminClient#createInstance}
     * @see [CreateInstace API Documentation](https://cloud.google.com/spanner/docs/reference/rpc/google.spanner.admin.instance.v1#google.spanner.admin.instance.v1.InstanceAdmin.CreateInstance)
     *
     * @throws {Error} If a name is not provided.
     * @throws {Error} If a configuration object is not provided.
     *
     * @param {string} name The name of the instance to be created.
     * @param {CreateInstanceRequest} config Configuration object.
     * @param {CreateInstanceCallback} [callback] Callback function.
     * @returns {Promise<CreateInstanceResponse>}
     *
     * @example
     * ```
     * const {Spanner} = require('@google-cloud/spanner');
     * const spanner = new Spanner();
     *
     * const config = {
     *   config: 'regional-us-central1',
     *   nodes: 1
     * };
     *
     * function callback(err, instance, operation, apiResponse) {
     *   if (err) {
     *     // Error handling omitted.
     *   }
     *
     *   operation
     *     .on('error', function(err) {})
     *     .on('complete', function() {
     *       // Instance created successfully.
     *     });
     * }
     *
     * spanner.createInstance('new-instance-name', config, callback);
     *
     * //-
     * // If the callback is omitted, we'll return a Promise.
     * //-
     * spanner.createInstance('new-instance-name', config)
     *   .then(function(data) {
     *     const instance = data[0];
     *     const operation = data[1];
     *     return operation.promise();
     *   })
     *   .then(function() {
     *     // Instance created successfully.
     *   });
     * ```
     */
    createInstance(name: string, config: CreateInstanceRequest): Promise<CreateInstanceResponse>;
    createInstance(name: string, config: CreateInstanceRequest, callback: CreateInstanceCallback): void;
    /**
     * Query object for listing instances.
     *
     * @typedef {object} GetInstancesOptions
     * @property {object} [gaxOptions] Request configuration options,
     *     See {@link https://googleapis.dev/nodejs/google-gax/latest/interfaces/CallOptions.html|CallOptions}
     *     for more details.
     * @property {string} [filter] An expression for filtering the results of the
     *     request. Filter rules are case insensitive. The fields eligible for
     *     filtering are:
     *     - **`name`**
     *     - **`display_name`**
     *     - **`labels.key`** where key is the name of a label
     *
     *     Some examples of using filters are:
     *     - **`name:*`** The instance has a name.
     *     - **`name:Howl`** The instance's name is howl.
     *     - **`labels.env:*`** The instance has the label env.
     *     - **`labels.env:dev`** The instance's label env has the value dev.
     *     - **`name:howl labels.env:dev`** The instance's name is howl and it has
     *       the label env with value dev.
     * @property {number} [pageSize] Maximum number of results per page.
     * @property {string} [pageToken] A previously-returned page token
     *     representing part of the larger set of results to view.
     */
    /**
     * @typedef {array} GetInstancesResponse
     * @property {Instance[]} 0 Array of {@link Instance} instances.
     * @property {object} 1 A query object to receive more results.
     * @property {object} 2 The full API response.
     */
    /**
     * @callback GetInstancesCallback
     * @param {?Error} err Request error, if any.
     * @param {Instance[]} instances Array of {@link Instance} instances.
     * @param {string} nextQuery A query object to receive more results.
     * @param {object} apiResponse The full API response.
     */
    /**
     * Get a list of instances.
     *
     * Wrapper around {@link v1.InstanceAdminClient#listInstances}.
     *
     * @see {@link v1.InstanceAdminClient#listInstances}
     * @see [ListInstances API Documentation](https://cloud.google.com/spanner/docs/reference/rpc/google.spanner.admin.instance.v1#google.spanner.admin.instance.v1.InstanceAdmin.ListInstances)
     *
     * @param {GetInstancesOptions} [options] Query object for listing instances.
     * @param {GetInstancesCallback} [callback] Callback function.
     * @returns {Promise<GetInstancesResponse>}
     *
     * @example
     * ```
     * const {Spanner} = require('@google-cloud/spanner');
     * const spanner = new Spanner();
     *
     * spanner.getInstances(function(err, instances) {
     *   // `instances` is an array of `Instance` objects.
     * });
     *
     * //-
     * // To control how many API requests are made and page through the results
     * // manually, set `autoPaginate` to `false`.
     * //-
     * function callback(err, instances, nextQuery, apiResponse) {
     *   if (nextQuery) {
     *     // More results exist.
     *     spanner.getInstances(nextQuery, callback);
     *   }
     * }
     *
     * spanner.getInstances({
     *   gaxOptions: {
     *     autoPaginate: false,
     *   }
     * }, callback);
     *
     * //-
     * // If the callback is omitted, we'll return a Promise.
     * //-
     * spanner.getInstances().then(function(data) {
     *   const instances = data[0];
     * });
     * ```
     */
    getInstances(options?: GetInstancesOptions): Promise<GetInstancesResponse>;
    getInstances(callback: GetInstancesCallback): void;
    getInstances(query: GetInstancesOptions, callback: GetInstancesCallback): void;
    /**
     * Get a list of {@link Instance} objects as a readable object stream.
     *
     * Wrapper around {@link v1.InstanceAdminClient#listInstances}.
     *
     * @see {@link v1.InstanceAdminClient#listInstances}
     * @see [ListInstances API Documentation](https://cloud.google.com/spanner/docs/reference/rpc/google.spanner.admin.instance.v1#google.spanner.admin.instance.v1.InstanceAdmin.ListInstances)
     *
     * @method Spanner#getInstancesStream
     * @param {GetInstancesOptions} [options] Query object for listing instances.
     * @returns {ReadableStream} A readable stream that emits {@link Instance}
     *     instances.
     *
     * @example
     * ```
     * const {Spanner} = require('@google-cloud/spanner');
     * const spanner = new Spanner();
     *
     * spanner.getInstancesStream()
     *   .on('error', console.error)
     *   .on('data', function(instance) {
     *     // `instance` is an `Instance` object.
     *   })
     *   .on('end', function() {
     *     // All instances retrieved.
     *   });
     *
     * //-
     * // If you anticipate many results, you can end a stream early to prevent
     * // unnecessary processing and API requests.
     * //-
     * spanner.getInstancesStream()
     *   .on('data', function(instance) {
     *     this.end();
     *   });
     * ```
     */
    getInstancesStream(options?: GetInstancesOptions): NodeJS.ReadableStream;
    /**
     * Lists the supported instance configurations for a given project.
     *
     * @typedef {object} GetInstanceConfigsOptions
     * @property {number} [pageSize] Maximum number of results per page.
     * @property {string} [pageToken] A previously-returned page token
     *     representing part of the larger set of results to view.
     * @property {object} [gaxOptions] Request configuration options,
     *     See {@link https://googleapis.dev/nodejs/google-gax/latest/interfaces/CallOptions.html|CallOptions}
     *     for more details.
     */
    /**
     * @typedef {array} GetInstanceConfigsResponse
     * @property {object[]} 0 List of all available instance configs.
     * @property {string} 0.name The unique identifier for the instance config.
     * @property {string} 0.displayName The name of the instance config as it
     *     appears in UIs.
     * @property {google.spanner.admin.instance.v1.IReplicaInfo[]} 0.replicas The replicas used by
     *     this instance config.
     * @property {string[]} 0.leaderOptions The possible leader options for this instance config.
     * @property {object} 1 A query object to receive more results.
     * @property {object} 2 The full API response.
     */
    /**
     * @callback GetInstanceConfigsCallback
     * @param {?Error} err Request error, if any.
     * @param {object[]} instanceConfigs List of all available instance configs.
     * @param {string} instanceConfigs.name The unique identifier for the instance
     *     config.
     * @param {string} instanceConfigs.displayName The name of the instance config
     *     as it appears in UIs.
     * @param {google.spanner.admin.instance.v1.IReplicaInfo[]} instanceConfigs.replicas The replicas used by
     *     this instance config.
     * @param {string[]} instanceConfigs.leaderOptions The possible leader options for this instance config.
     * @param {object} nextQuery A query object to receive more results.
     * @param {object} apiResponse The full API response.
     */
    /**
     * Get a list of instance configs.
     *
     * Wrapper around {@link v1.InstanceAdminClient#listInstanceConfigs}.
     *
     * @see {@link v1.InstanceAdminClient#listInstanceConfigs}
     * @see [ListInstanceConfigs API Documentation](https://cloud.google.com/spanner/docs/reference/rpc/google.spanner.admin.instance.v1#google.spanner.admin.instance.v1.InstanceAdmin.ListInstanceConfigs)
     *
     * @param {GetInstanceConfigsOptions} [options] Query object for listing instance
     *     configs.
     * @param {GetInstanceConfigsCallback} [callback] Callback function.
     * @returns {Promise<GetInstanceConfigsResponse>}
     *
     * @example
     * ```
     * const {Spanner} = require('@google-cloud/spanner');
     * const spanner = new Spanner();
     *
     * spanner.getInstanceConfigs(function(err, instanceConfigs) {
     *   // `instanceConfigs` is an array of instance configuration descriptors.
     * });
     *
     * //-
     * // To control how many API requests are made and page through the results
     * // manually, set `autoPaginate` to `false`.
     * //-
     * function callback(err, instanceConfigs, nextQuery, apiResponse) {
     *   if (nextQuery) {
     *     // More results exist.
     *     spanner.getInstanceConfigs(nextQuery, callback);
     *   }
     * }
     *
     * spanner.getInstanceConfigs({
     *   gaxOptions: {
     *     autoPaginate: false,
     *   }
     * }, callback);
     *
     * //-
     * // If the callback is omitted, we'll return a Promise.
     * //-
     * spanner.getInstanceConfigs().then(function(data) {
     *   const instanceConfigs = data[0];
     * });
     * ```
     */
    getInstanceConfigs(query?: GetInstanceConfigsOptions): Promise<GetInstanceConfigsResponse>;
    getInstanceConfigs(callback: GetInstanceConfigsCallback): void;
    getInstanceConfigs(query: GetInstanceConfigsOptions, callback: GetInstanceConfigsCallback): void;
    /**
     * Get a list of instance configs as a readable object stream.
     *
     * Wrapper around {@link v1.InstanceAdminClient#listInstanceConfigsStream}.
     *
     * @see {@link v1.InstanceAdminClient#listInstanceConfigsStream}
     * @see [ListInstanceConfigs API Documentation](https://cloud.google.com/spanner/docs/reference/rpc/google.spanner.admin.instance.v1#google.spanner.admin.instance.v1.InstanceAdmin.ListInstanceConfigs)
     *
     * @method Spanner#getInstanceConfigsStream
     * @param {GetInstanceConfigsOptions} [options] Query object for listing instance
     *     configs.
     * @returns {ReadableStream} A readable stream that emits instance configs.
     *
     * @example
     * ```
     * const {Spanner} = require('@google-cloud/spanner');
     * const spanner = new Spanner();
     *
     * spanner.getInstanceConfigsStream()
     *   .on('error', console.error)
     *   .on('data', function(instanceConfig) {})
     *   .on('end', function() {
     *     // All instances retrieved.
     *   });
     *
     * //-
     * // If you anticipate many results, you can end a stream early to prevent
     * // unnecessary processing and API requests.
     * //-
     * spanner.getInstanceConfigsStream()
     *   .on('data', function(instanceConfig) {
     *     this.end();
     *   });
     * ```
     */
    getInstanceConfigsStream(options?: GetInstanceConfigsOptions): NodeJS.ReadableStream;
    /**
     * Gets the instance configuration with the specified name.
     */
    /**
     * @typedef {array} GetInstanceConfigResponse
     * @property {object[]} 0 The metadata of the instance config.
     * @property {string} 0.name The unique identifier for the instance config.
     * @property {string} 0.displayName The name of the instance config as it
     *     appears in UIs.
     * @property {google.spanner.admin.instance.v1.IReplicaInfo[]} 0.replicas The replicas used by
     *     this instance config.
     * @property {string[]} 0.leaderOptions The possible leader options for this instance config.
     */
    /**
     * @callback GetInstanceConfigCallback
     * @param {?Error} err Request error, if any.
     * @param {object} instanceConfig The metadata of the instance config.
     * @param {string} instanceConfig.name The unique identifier for the instance
     *     config.
     * @param {string} instanceConfig.displayName The name of the instance config
     *     as it appears in UIs.
     * @param {google.spanner.admin.instance.v1.IReplicaInfo[]} instanceConfig.replicas The replicas used by
     *     this instance config.
     * @param {string[]} 0.leaderOptions The possible leader options for this instance config.
     */
    /**
     * Get a specific instance config.
     *
     * Wrapper around {@link v1.InstanceAdminClient#getInstanceConfig}.
     *
     * @see {@link v1.InstanceAdminClient#getInstanceConfig}
     * @see [GetInstanceConfig API Documentation](https://cloud.google.com/spanner/docs/reference/rpc/google.spanner.admin.instance.v1#google.spanner.admin.instance.v1.InstanceAdmin.GetInstanceConfig)
     *
     * @param {string} [name] The name of the instance config to get.
     * @param {GetInstanceConfigCallback} [callback] Callback function.
     * @returns {Promise<GetInstanceConfigResponse>}
     *
     * @example
     * ```
     * const {Spanner} = require('@google-cloud/spanner');
     * const spanner = new Spanner();
     *
     * spanner.getInstanceConfig('nam6', function(err, instanceConfig) {
     *   // `instanceConfig` is an instance configuration descriptor.
     * });
     *
     * //-
     * // If the callback is omitted, we'll return a Promise.
     * //-
     * spanner.getInstanceConfig().then(function(data) {
     *   const instanceConfig = data[0];
     * });
     * ```
     */
    getInstanceConfig(name: string): Promise<GetInstanceConfigResponse>;
    getInstanceConfig(name: string, options: GetInstanceConfigOptions): Promise<GetInstanceConfigResponse>;
    getInstanceConfig(name: string, callback: GetInstanceConfigCallback): void;
    getInstanceConfig(name: string, options: GetInstanceConfigOptions, callback: GetInstanceConfigCallback): void;
    /**
     * Get a reference to an Instance object.
     *
     * @throws {Error} If a name is not provided.
     *
     * @param {string} name The name of the instance.
     * @returns {Instance} An Instance object.
     *
     * @example
     * ```
     * const {Spanner} = require('@google-cloud/spanner');
     * const spanner = new Spanner();
     * const instance = spanner.instance('my-instance');
     * ```
     */
    instance(name: string): Instance;
    /**
     * Prepare a gapic request. This will cache the GAX client and replace
     * {{projectId}} placeholders, if necessary.
     *
     * @private
     *
     * @param {object} config Request config
     * @param {function} callback Callback function
     */
    prepareGapicRequest_(config: any, callback: any): void;
    /**
     * Funnel all API requests through this method to be sure we have a project
     * ID.
     *
     * @param {object} config Configuration object.
     * @param {object} config.gaxOpts GAX options.
     * @param {function} config.method The gax method to call.
     * @param {object} config.reqOpts Request options.
     * @param {function} [callback] Callback function.
     * @returns {Promise}
     */
    request(config: any, callback?: any): any;
    /**
     * Funnel all streaming API requests through this method to be sure we have a
     * project ID.
     *
     * @param {object} config Configuration object.
     * @param {object} config.gaxOpts GAX options.
     * @param {function} config.method The gax method to call.
     * @param {object} config.reqOpts Request options.
     * @param {function} [callback] Callback function.
     * @returns {Stream}
     */
    requestStream(config: any): any;
    static date(dateString?: string): any;
    static date(year: number, month: number, date: number): any;
    /**
     * Date object with nanosecond precision. Supports all standard Date arguments
     * in addition to several custom types.
     * @external PreciseDate
     * @see {@link https://github.com/googleapis/nodejs-precise-date|PreciseDate}
     */
    /**
     * Helper function to get a Cloud Spanner Timestamp object.
     *
     * String timestamps should have a canonical format of
     * `YYYY-[M]M-[D]D[( |T)[H]H:[M]M:[S]S[.DDDDDDDDD]]Z`
     *
     * **Timestamp values must be expressed in Zulu time and cannot include a UTC
     * offset.**
     *
     * @see https://cloud.google.com/spanner/docs/data-types#timestamp-type
     *
     * @param {string|number|google.protobuf.Timestamp|external:PreciseDate}
     *     [timestamp] Either a RFC 3339 timestamp formatted string or a
     *     {@link google.protobuf.Timestamp} object. If a PreciseDate is given, it
     *     will return that timestamp as is.
     * @returns {external:PreciseDate}
     *
     * @example
     * ```
     * const timestamp = Spanner.timestamp('2019-02-08T10:34:29.481145231Z');
     *
     * ```
     * @example With a `google.protobuf.Timestamp` object
     * ```
     * const [seconds, nanos] = process.hrtime();
     * const timestamp = Spanner.timestamp({seconds, nanos});
     * ```
     *
     * @example With a Date timestamp
     * ```
     * const timestamp = Spanner.timestamp(Date.now());
     * ```
     */
    static timestamp(value?: string | number | p.ITimestamp | PreciseDate): PreciseDate;
    /**
     * Helper function to get a Cloud Spanner Float64 object.
     *
     * @param {string|number} value The float as a number or string.
     * @returns {Float}
     *
     * @example
     * ```
     * const {Spanner} = require('@google-cloud/spanner');
     * const float = Spanner.float(10);
     * ```
     */
    static float(value: any): Float;
    /**
     * Helper function to get a Cloud Spanner Int64 object.
     *
     * @param {string|number} value The int as a number or string.
     * @returns {Int}
     *
     * @example
     * ```
     * const {Spanner} = require('@google-cloud/spanner');
     * const int = Spanner.int(10);
     * ```
     */
    static int(value: any): Int;
    /**
     * Helper function to get a Cloud Spanner Numeric object.
     *
     * @param {string} value The numeric value as a string.
     * @returns {Numeric}
     *
     * @example
     * ```
     * const {Spanner} = require('@google-cloud/spanner');
     * const numeric = Spanner.numeric("3.141592653");
     * ```
     */
    static numeric(value: any): Numeric;
    /**
     * Helper function to get a Cloud Spanner Struct object.
     *
     * @param {object} value The struct as a JSON object.
     * @returns {Struct}
     *
     * @example
     * ```
     * const {Spanner} = require('@google-cloud/spanner');
     * const struct = Spanner.struct({
     *   user: 'bob',
     *   age: 32
     * });
     * ```
     */
    static struct(value?: any): Struct;
}
/**
 * The default export of the `@google-cloud/spanner` package is the
 * {@link Spanner} class.
 *
 * See {@link Spanner} and {@link ClientConfig} for client methods and
 * configuration options.
 *
 * @module {constructor} @google-cloud/spanner
 * @alias nodejs-spanner
 *
 * @example Install the client library with <a
 * href="https://www.npmjs.com/">npm</a>:
 * ```
 * npm install --save @google-cloud/spanner
 * ```
 *
 * @example Import the client library
 * ```
 * const {Spanner} = require('@google-cloud/spanner');
 * ```
 *
 * @example Create a client that uses <a
 * href="https://cloud.google.com/docs/authentication/production#providing_credentials_to_your_application">Application
 * Default Credentials (ADC)</a>:
 * ```
 * const client = new Spanner();
 * ```
 *
 * @example Create a client with <a
 * href="https://cloud.google.com/docs/authentication/production#obtaining_and_providing_service_account_credentials_manually">explicit
 * credentials</a>:
 * ```
 * const client = new Spanner({ projectId:
 * 'your-project-id', keyFilename: '/path/to/keyfile.json'
 * });
 * ```
 *
 * @example <caption>include:samples/quickstart.js</caption>
 * region_tag:spanner_quickstart
 * Full quickstart example:
 */
export { Spanner };
/**
 * {@link Instance} class.
 *
 * @name Spanner.Instance
 * @see Instance
 * @type {Constructor}
 */
export { Instance };
/**
 * {@link Database} class.
 *
 * @name Spanner.Database
 * @see Database
 * @type {Constructor}
 */
export { Database };
/**
 * {@link Backup} class.
 *
 * @name Spanner.Backup
 * @see Backup
 * @type {Constructor}
 */
export { Backup };
/**
 * {@link Session} class.
 *
 * @name Spanner.Session
 * @see Session
 * @type {Constructor}
 */
export { Session };
/**
 * {@link SessionPool} class.
 *
 * @name Spanner.SessionPool
 * @see SessionPool
 * @type {Constructor}
 */
export { SessionPool };
/**
 * {@link Table} class.
 *
 * @name Spanner.Table
 * @see Table
 * @type {Constructor}
 */
export { Table };
/**
 * {@link PartitionedDml} class.
 *
 * @name Spanner.PartitionedDml
 * @see PartitionedDml
 * @type {Constructor}
 */
export { PartitionedDml };
/**
 * {@link Snapshot} class.
 *
 * @name Spanner.Snapshot
 * @see Snapshot
 * @type {Constructor}
 */
export { Snapshot };
/**
 * {@link Transaction} class.
 *
 * @name Spanner.Transaction
 * @see Transaction
 * @type {Constructor}
 */
export { Transaction };
/**
 * @type {object}
 * @property {constructor} DatabaseAdminClient
 *   Reference to {@link v1.DatabaseAdminClient}
 * @property {constructor} InstanceAdminClient
 *   Reference to {@link v1.InstanceAdminClient}
 * @property {constructor} SpannerClient
 *   Reference to {@link v1.SpannerClient}
 */
import * as protos from '../protos/protos';
import IInstanceConfig = instanceAdmin.spanner.admin.instance.v1.IInstanceConfig;
export { v1, protos };
declare const _default: {
    Spanner: typeof Spanner;
};
export default _default;