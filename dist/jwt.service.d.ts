/// <reference types="node" />
import * as jwt from 'jsonwebtoken';
import { JwtModuleOptions, JwtSignOptions, JwtVerifyOptions } from './interfaces';
export declare class JwtService {
    private readonly options;
    private readonly logger;
    constructor(options?: JwtModuleOptions);
    sign(payload: string, options?: Omit<JwtSignOptions, keyof jwt.SignOptions>): Promise<string>;
    sign(payload: Buffer | object, options?: JwtSignOptions): Promise<string>;
    verify<T extends object = any>(token: string, options?: JwtVerifyOptions): Promise<T>;
    decode(token: string, options?: jwt.DecodeOptions): null | {
        [key: string]: any;
    } | string;
    private mergeJwtOptions;
    private getSecretKey;
}
