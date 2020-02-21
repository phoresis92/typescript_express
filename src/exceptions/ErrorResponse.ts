class ErrorResponse extends Error {
    constructor(public status: number, public message: string, public errorCode: number) {
        super(message);
    }
}

export default ErrorResponse;
