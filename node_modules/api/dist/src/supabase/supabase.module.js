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
exports.SupabaseModule = exports.InjectSupabase = exports.SUPABASE_CLIENT = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const supabase_config_1 = require("../config/supabase.config");
exports.SUPABASE_CLIENT = 'SUPABASE_CLIENT';
const InjectSupabase = () => (0, common_1.Inject)(exports.SUPABASE_CLIENT);
exports.InjectSupabase = InjectSupabase;
let SupabaseModule = class SupabaseModule {
    supabase;
    constructor(supabase) {
        this.supabase = supabase;
    }
    async onModuleDestroy() {
        await this.supabase.auth.signOut();
    }
};
exports.SupabaseModule = SupabaseModule;
exports.SupabaseModule = SupabaseModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [config_1.ConfigModule],
        providers: [
            {
                provide: exports.SUPABASE_CLIENT,
                useFactory: (configService) => {
                    return (0, supabase_config_1.getSupabaseConfig)(configService);
                },
                inject: [config_1.ConfigService],
            },
            {
                provide: 'SUPABASE_AUTH',
                useFactory: (supabase) => {
                    return supabase.auth;
                },
                inject: [exports.SUPABASE_CLIENT],
            },
        ],
        exports: [exports.SUPABASE_CLIENT, 'SUPABASE_AUTH'],
    }),
    __param(0, (0, common_1.Inject)(exports.SUPABASE_CLIENT)),
    __metadata("design:paramtypes", [Function])
], SupabaseModule);
//# sourceMappingURL=supabase.module.js.map