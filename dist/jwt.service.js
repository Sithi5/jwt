"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtService = void 0;
const common_1 = require("@nestjs/common");
const jwt = require("jsonwebtoken");
const interfaces_1 = require("./interfaces");
const jwt_constants_1 = require("./jwt.constants");
let JwtService = exports.JwtService = class JwtService {
    constructor(options = {}) {
        this.options = options;
        this.logger = new common_1.Logger('JwtService');
    }
    async sign(payload, options) {
        const signOptions = this.mergeJwtOptions({ ...options }, 'signOptions');
        const secret = await this.getSecretKey(payload, options, 'privateKey', interfaces_1.JwtSecretRequestType.SIGN);
        const allowedSignOptKeys = ['secret', 'privateKey'];
        const signOptKeys = Object.keys(signOptions);
        if (typeof payload === 'string' &&
            signOptKeys.some((k) => !allowedSignOptKeys.includes(k))) {
            throw new Error('Payload as string is not allowed with the following sign options: ' +
                signOptKeys.join(', '));
        }
        return new Promise((resolve, reject) => jwt.sign(payload, secret, signOptions, (err, encoded) => err ? reject(err) : resolve(encoded)));
    }
    async verify(token, options) {
        const verifyOptions = this.mergeJwtOptions({ ...options }, 'verifyOptions');
        const secret = await this.getSecretKey(token, options, 'publicKey', interfaces_1.JwtSecretRequestType.VERIFY);
        return new Promise((resolve, reject) => jwt.verify(token, secret, verifyOptions, (err, decoded) => err ? reject(err) : resolve(decoded)));
    }
    decode(token, options) {
        return jwt.decode(token, options);
    }
    mergeJwtOptions(options, key) {
        delete options.secret;
        if (key === 'signOptions') {
            delete options.privateKey;
        }
        else {
            delete options.publicKey;
        }
        return options
            ? {
                ...(this.options[key] || {}),
                ...options
            }
            : this.options[key];
    }
    async getSecretKey(token, options, key, secretRequestType) {
        let secret = this.options.secretOrKeyProvider
            ? await this.options.secretOrKeyProvider(secretRequestType, token, options)
            : options?.secret ||
                this.options.secret ||
                (key === 'privateKey'
                    ? options?.privateKey || this.options.privateKey
                    : options?.publicKey ||
                        this.options.publicKey) ||
                this.options[key];
        if (this.options.secretOrPrivateKey) {
            this.logger.warn(`"secretOrPrivateKey" has been deprecated, please use the new explicit "secret" or use "secretOrKeyProvider" or "privateKey"/"publicKey" exclusively.`);
            secret = this.options.secretOrPrivateKey;
        }
        return secret;
    }
};
exports.JwtService = JwtService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Optional)()),
    __param(0, (0, common_1.Inject)(jwt_constants_1.JWT_MODULE_OPTIONS)),
    __metadata("design:paramtypes", [Object])
], JwtService);
