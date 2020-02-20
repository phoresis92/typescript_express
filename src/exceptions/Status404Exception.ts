import HttpException from './HttpException';

class Status404Exception extends HttpException {
    constructor(params) {
        super(404, 'Invalid Address', params);
    }
}

export default Status404Exception;
