export type ResponseData<T = unknown> = {
    success: boolean;
    message: string;
    data?: T;
} | null;

export class ApiError<T = unknown> extends Error {
    status: number;
    responseData: ResponseData<T>;

    constructor(status: number, message: string, responseData: ResponseData<T> = null) {
        super(message);
        this.status = status;
        this.responseData = responseData;
        this.name = "ApiError";
    }
}

export type PaginationLink = {
    url: string | null;
    label: string;
    page: number | null;
    active: boolean;
};

export type PaginationLinks = {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
};

export type PaginationMeta = {
    current_page: number;
    from: number | null;
    last_page: number;
    links: PaginationLink[];
    path: string;
    per_page: number;
    to: number | null;
    total: number;
};

export type PaginatedResponse<T> = {
    data: T[];
    links: PaginationLinks;
    meta: PaginationMeta;
};