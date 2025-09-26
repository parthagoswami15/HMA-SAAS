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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshTokenResponseDto = exports.RefreshTokenDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class RefreshTokenDto {
    refreshToken;
}
exports.RefreshTokenDto = RefreshTokenDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Refresh token to get a new access token',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    }),
    __metadata("design:type", String)
], RefreshTokenDto.prototype, "refreshToken", void 0);
class RefreshTokenResponseDto {
    accessToken;
    refreshToken;
}
exports.RefreshTokenResponseDto = RefreshTokenResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'New access token',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    }),
    __metadata("design:type", String)
], RefreshTokenResponseDto.prototype, "accessToken", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'New refresh token',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        required: false,
    }),
    __metadata("design:type", String)
], RefreshTokenResponseDto.prototype, "refreshToken", void 0);
//# sourceMappingURL=refresh-token.dto.js.map