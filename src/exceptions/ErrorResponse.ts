class ErrorResponse extends Error {
    constructor(public status: number, public message: string, public errorCode: string) {
        super(message);
    }
}

export default ErrorResponse;
