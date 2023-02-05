import ApiResponse from '../interfaces/ApiResponse';

const createResponse = (
    status: boolean,
    message: string,
    data?: Object
): ApiResponse => {

    let response: ApiResponse = {
        status: status,
        message: message,
        data: data ? data : undefined
    }
    return response
}

export default createResponse