class HttpException extends Error {
    public status: number;
    public message: string;
    public params: object;

  constructor(status: number, message: string, params?: object) {
    super(message);
    this.status = status;
    this.message = message;
    this.params = params!;
  }
}

export default HttpException;
