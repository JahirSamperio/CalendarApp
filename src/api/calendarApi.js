import axios from "axios";
import { getEnvVariables } from "../helpers";

const { VITE_API_URL } = getEnvVariables();

const calendarApi = axios.create({
    baseURL: VITE_API_URL
})

//TODO: configurar interceptores
calendarApi.interceptors.request.use( config => {

    //Revisa que el token siga valido
    //Envia el token en cada peticion mientras sea valido
    config.headers = {
        ...config.headers,
        'x-token': localStorage.getItem("token")
    }

    return config
})

export default calendarApi;