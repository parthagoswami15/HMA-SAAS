export declare class PaginatedMetaDto {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
}
export declare class PaginatedResponseDto<T> {
    items: T[];
    meta: PaginatedMetaDto;
}
