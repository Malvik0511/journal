/**
 * Методы получения данных с backend
 */
import axios from "axios";

let RequestApi = {};

/**
 * запрос к апи
 * @param params
 * @returns {Promise<any>}
 */
RequestApi.request = params =>
        axios({
            url: `/api/${params.additional.url}`,
            method: params.additional.method || "POST",
            responseType: "json",
            dataType: 'json',
            timeout: 10000,
            data: (!params.additional.method || params.additional.method === "POST") && (params.body || {}),
            params: (params.additional.method === "GET") && (params.body || {})
        })
            .then(response => response.data)
            .catch(error => Promise.reject(error.response));

export default RequestApi;