type AppErrorType = "Error" | "Fatal";


export class AppError extends Error {
    name = 'AppError';
    type: AppErrorType;
    constructor(type: AppErrorType, message: string) {
        super(message);
        this.type = type;
    }
}
