import HttpException from './HttpException';

class Status404Exception extends HttpException {
    constructor(params: any) {
        super(404, 'Invalid Address', params);
    }
}

export default Status404Exception;
