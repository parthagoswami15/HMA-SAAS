import { Logger } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
export interface PaginationOptions {
    page?: number;
    limit?: number;
    orderBy?: {
        column: string;
        ascending: boolean;
    };
}
export declare abstract class SupabaseBaseRepository<T> {
    protected readonly supabase: SupabaseClient;
    protected abstract tableName: string;
    protected readonly logger: Logger;
    constructor(supabase: SupabaseClient);
    protected get table(): import("@supabase/postgrest-js").PostgrestQueryBuilder<any, any, any, string, unknown>;
    create(data: Partial<T>): Promise<T>;
    findOne(where: Partial<T>): Promise<T | null>;
    findMany(where?: Partial<T>, options?: PaginationOptions): Promise<{
        data: T[];
        count: number;
    }>;
    update(where: Partial<T>, data: Partial<T>): Promise<T | null>;
    delete(where: Partial<T>): Promise<boolean>;
    exists(where: Partial<T>): Promise<boolean>;
    count(where?: Partial<T>): Promise<number>;
    private applyWhere;
}
