export interface ServerError {
    statusCode: number;
    message: string;
    details: string;
}

// 112. created to handle 500 errors in client - interface for the properties in data obj returned on 500 error.

