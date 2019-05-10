const axios = require('axios');

const { apiKey, apiUrl } = require("../modules/constant");
/**
 * Класс работает с API расписания
 * @params
 *    url - url метода API
 */
class ServiceApi {
    constructor(params) {
        this.methodUrl = params.params;
    }

    /**
     * Запрос к API
     * @return {Promise}
     */
    request() {
        return new Promise((resolve, reject) => {
            axios({
                url: `${apiUrl}?apikey=${apiKey}${this.methodUrl}`,
                method: 'GET',
                dataType: 'json',
                responseType: 'json',
                timeout: 5000
            })
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    reject(error.response);
                })
        })
    }

}

module.exports = ServiceApi;
