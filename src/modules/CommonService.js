/**
 * Методы получения данных с backend
 */
import axios from "axios";

let CommonService = {};

/**
 * запрос к апи
 * @param params
 * @returns {Promise<any>}
 */
CommonService.request = params => {
    return new Promise((resolve, reject) => {
        axios({
            url: `/api${ params.url }`,
            method: "GET",
            responseType: "json"
        })
            .then(response => resolve(response.data))
            .catch(error => reject(error.response));
    });
};

export default CommonService;