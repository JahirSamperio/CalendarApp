import { useDispatch, useSelector } from "react-redux"
import { calendarApi } from "../api"
import { clearErrorMessage, onChecking, onLogin, onLogout, onLogoutCalendar } from "../store"

export const useAuthStore = () => {

    const { status, user, errorMessage } = useSelector( state => state.auth)
    const dispatch = useDispatch()

    const startLogin = async({ email, password }) => {
        console.log({email, password})

        dispatch(onChecking());

        try {
            
            //Se dispara la accion en el backend y trae la info del usuario
            const {data} = await calendarApi.post('/auth', {email, password});


            localStorage.setItem('token', data.token);
            //Esto es para hacer calculos de lo que dqeuda del token 
            localStorage.setItem('token-init-date', new Date().getTime());

            //Se dispara la accion en redux y en store
            dispatch(onLogin({name: data.name, uid: data.uid}))

        } catch (error) {
            dispatch(onLogout('Credenciales incorrectas'))
            setTimeout(() => {
                dispatch(clearErrorMessage())
            }, 10)
        }
    }

    const startRegister = async({name, email, password}) => {
        dispatch(onChecking());

        try {
            const {data} = await calendarApi.post('/auth/new', {name, email, password});

            localStorage.setItem('token', data.token);
            //Esto es para hacer calculos de lo que dqeuda del token 
            localStorage.setItem('token-init-date', new Date().getTime());

            //Se dispara la accion en redux y en store
            dispatch(onLogin({name: data.name, uid: data.uid}))

        } catch (error) {
            
            dispatch(onLogout(error.response.data?.msg || '--'))
            setTimeout(() => {
                dispatch(clearErrorMessage())
            }, 10)
        }
    }

    const checkAuthToken = async() => {
        const token = localStorage.getItem("token");
        if( !token ) return dispatch(onLogout());

        //Revalida el token y lo setea
        try {
            const {data} = await calendarApi.get('/auth/renew');
            localStorage.setItem('token', data.token)
            localStorage.setItem('token-init-date', new Date().getTime());
            dispatch(onLogin({name: data.name, uid: data.uid}))
            
        } catch (error) {
            localStorage.clear();
            dispatch(onLogout());
        }
    }

    const startLogout = () => {
        localStorage.clear();
        dispatch(onLogoutCalendar())
        dispatch(onLogout())
    }


    return {
        //* Propiedades
        status, 
        user, 
        errorMessage,

        //* Metodos
        checkAuthToken,
        startLogin,
        startRegister,
        startLogout
    }
}