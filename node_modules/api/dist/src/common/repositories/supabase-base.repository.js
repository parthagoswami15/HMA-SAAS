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
exports.SupabaseBaseRepository = void 0;
const common_1 = require("@nestjs/common");
const supabase_js_1 = require("@supabase/supabase-js");
let SupabaseBaseRepository = class SupabaseBaseRepository {
    supabase;
    logger = new common_1.Logger(this.constructor.name);
    constructor(supabase) {
        this.supabase = supabase;
    }
    get table() {
        return this.supabase.from(this.tableName);
    }
    async create(data) {
        const { data: result, error } = await this.table.insert(data).select().single();
        if (error) {
            this.logger.error(`Error creating ${this.tableName}`, error);
            throw error;
        }
        return result;
    }
    async findOne(where) {
        let query = this.table.select('*');
        query = this.applyWhere(query, where);
        const { data, error } = await query.single();
        if (error && error.code !== 'PGRST116') {
            this.logger.error(`Error finding ${this.tableName}`, error);
            throw error;
        }
        return data;
    }
    async findMany(where = {}, options = {}) {
        const { page = 1, limit = 10, orderBy } = options;
        const from = (page - 1) * limit;
        const to = from + limit - 1;
        let query = this.table.select('*', { count: 'exact' });
        query = this.applyWhere(query, where);
        if (orderBy) {
            query = query.order(orderBy.column, { ascending: orderBy.ascending });
        }
        query = query.range(from, to);
        const { data, error, count } = await query;
        if (error) {
            this.logger.error(`Error finding ${this.tableName}`, error);
            throw error;
        }
        return {
            data: data,
            count: count || 0,
        };
    }
    async update(where, data) {
        let query = this.table.update(data).select();
        query = this.applyWhere(query, where);
        const { data: result, error } = await query.single();
        if (error && error.code !== 'PGRST116') {
            this.logger.error(`Error updating ${this.tableName}`, error);
            throw error;
        }
        return result;
    }
    async delete(where) {
        let query = this.table.delete();
        query = this.applyWhere(query, where);
        const { error } = await query;
        if (error) {
            this.logger.error(`Error deleting ${this.tableName}`, error);
            throw error;
        }
        return true;
    }
    async exists(where) {
        const result = await this.findOne(where);
        return !!result;
    }
    async count(where = {}) {
        let query = this.table.select('*', { count: 'exact', head: true });
        query = this.applyWhere(query, where);
        const { count, error } = await query;
        if (error) {
            this.logger.error(`Error counting ${this.tableName}`, error);
            throw error;
        }
        return count || 0;
    }
    applyWhere(query, where) {
        Object.entries(where).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                if (Array.isArray(value)) {
                    query = query.in(key, value);
                }
                else if (typeof value === 'object' && value !== null) {
                    Object.entries(value).forEach(([op, val]) => {
                        if (op === 'contains') {
                            query = query.ilike(key, `%${val}%`);
                        }
                        else if (op === 'startsWith') {
                            query = query.ilike(key, `${val}%`);
                        }
                        else if (op === 'endsWith') {
                            query = query.ilike(key, `%${val}`);
                        }
                        else {
                            query = query.filter(key, op, val);
                        }
                    });
                }
                else {
                    query = query.eq(key, value);
                }
            }
        });
        return query;
    }
};
exports.SupabaseBaseRepository = SupabaseBaseRepository;
exports.SupabaseBaseRepository = SupabaseBaseRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('SUPABASE_CLIENT')),
    __metadata("design:paramtypes", [supabase_js_1.SupabaseClient])
], SupabaseBaseRepository);
//# sourceMappingURL=supabase-base.repository.js.map