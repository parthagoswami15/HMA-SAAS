import { Injectable, Inject, Logger } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { PostgrestFilterBuilder } from '@supabase/postgrest-js';

export interface PaginationOptions {
  page?: number;
  limit?: number;
  orderBy?: {
    column: string;
    ascending: boolean;
  };
}

@Injectable()
export abstract class SupabaseBaseRepository<T> {
  protected abstract tableName: string;
  protected readonly logger = new Logger(this.constructor.name);

  constructor(@Inject('SUPABASE_CLIENT') protected readonly supabase: SupabaseClient) {}

  protected get table() {
    return this.supabase.from(this.tableName);
  }

  async create(data: Partial<T>): Promise<T> {
    const { data: result, error } = await this.table.insert(data).select().single();
    
    if (error) {
      this.logger.error(`Error creating ${this.tableName}`, error);
      throw error;
    }
    
    return result as unknown as T;
  }

  async findOne(where: Partial<T>): Promise<T | null> {
    let query = this.table.select('*');
    query = this.applyWhere(query, where);
    
    const { data, error } = await query.single();
    
    if (error && error.code !== 'PGRST116') { // PGRST116 = No rows found
      this.logger.error(`Error finding ${this.tableName}`, error);
      throw error;
    }
    
    return data as unknown as T;
  }

  async findMany(
    where: Partial<T> = {},
    options: PaginationOptions = {}
  ): Promise<{ data: T[]; count: number }> {
    const { page = 1, limit = 10, orderBy } = options;
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    
    let query = this.table.select('*', { count: 'exact' });
    
    // Apply where conditions
    query = this.applyWhere(query, where);
    
    // Apply ordering
    if (orderBy) {
      query = query.order(orderBy.column, { ascending: orderBy.ascending });
    }
    
    // Apply pagination
    query = query.range(from, to);
    
    const { data, error, count } = await query;
    
    if (error) {
      this.logger.error(`Error finding ${this.tableName}`, error);
      throw error;
    }
    
    return {
      data: data as unknown as T[],
      count: count || 0,
    };
  }

  async update(where: Partial<T>, data: Partial<T>): Promise<T | null> {
    let query = this.table.update(data).select();
    query = this.applyWhere(query, where);
    
    const { data: result, error } = await query.single();
    
    if (error && error.code !== 'PGRST116') { // PGRST116 = No rows found
      this.logger.error(`Error updating ${this.tableName}`, error);
      throw error;
    }
    
    return result as unknown as T;
  }

  async delete(where: Partial<T>): Promise<boolean> {
    let query = this.table.delete();
    query = this.applyWhere(query, where);
    
    const { error } = await query;
    
    if (error) {
      this.logger.error(`Error deleting ${this.tableName}`, error);
      throw error;
    }
    
    return true;
  }

  async exists(where: Partial<T>): Promise<boolean> {
    const result = await this.findOne(where);
    return !!result;
  }

  async count(where: Partial<T> = {}): Promise<number> {
    let query = this.table.select('*', { count: 'exact', head: true });
    query = this.applyWhere(query, where);
    
    const { count, error } = await query;
    
    if (error) {
      this.logger.error(`Error counting ${this.tableName}`, error);
      throw error;
    }
    
    return count || 0;
  }

  // Helper method to apply where conditions
  private applyWhere<TData>(
    query: PostgrestFilterBuilder<any, any, any>,
    where: Record<string, any>
  ): PostgrestFilterBuilder<any, any, any> {
    Object.entries(where).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          query = query.in(key, value);
        } else if (typeof value === 'object' && value !== null) {
          // Handle operators like { gte: 10 }
          Object.entries(value).forEach(([op, val]) => {
            if (op === 'contains') {
              query = query.ilike(key, `%${val}%`);
            } else if (op === 'startsWith') {
              query = query.ilike(key, `${val}%`);
            } else if (op === 'endsWith') {
              query = query.ilike(key, `%${val}`);
            } else {
              // Handle other operators like eq, neq, gt, gte, lt, lte, etc.
              query = query.filter(key, op, val);
            }
          });
        } else {
          // Simple equality
          query = query.eq(key, value);
        }
      }
    });
    
    return query;
  }
}
