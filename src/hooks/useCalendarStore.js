import { useDispatch, useSelector } from "react-redux";
import { onAddNewEvent, onDeleteEvent, onLoadEvents, onSetActiveEvent, onUpdateEvent } from "../store/calendar/calendarSlice";
import { calendarApi } from "../api";
import { convertEventsToDateEvents } from "../helpers";
import Swal from "sweetalert2";

export const useCalendarStore = () => {


    const dispatch = useDispatch();
    const { events, activeEvent } = useSelector(state => state.calendar);
    const { user } = useSelector(state => state.auth);

    const setActiveEvent = (calendarEvent) => {
        dispatch(onSetActiveEvent(calendarEvent))
    }

    const startSavingEvent = async (calendarEvent) => {
        //TODO: llegar al backend

        try {
            if (calendarEvent.id) {
                //actualizando
                const { data } = await calendarApi.put(`/events/${calendarEvent.id}`, calendarEvent);
                dispatch(onUpdateEvent({ ...calendarEvent, user }));
                return;
            }

            //creando
            const { data } = await calendarApi.post('/events', calendarEvent);
            console.log({ data });
            dispatch(onAddNewEvent({ ...calendarEvent, id: data.eventoGuardado.id, user }));

        } catch (error) {
            console.log(error);
            Swal.fire('Error al guardar', error.response.data?.msg, 'error')
        }



    }

    const startDeletingEvent = async() => {
        //TODO: llegar al backend
        try {
                //eliminando
                await calendarApi.delete(`/events/${activeEvent.id}`);
                dispatch(onDeleteEvent());
        } catch (error) {
            console.log(error);
            Swal.fire('Error al eliminar', error.response.data.msg, 'error')
        }
    }

    const startLoadingEvents = async () => {
        try {

            const { data } = await calendarApi.get('/events')
            const eventos = convertEventsToDateEvents(data.eventos)
            dispatch(onLoadEvents(eventos))

        } catch (error) {
            console.log('Error cargando eventos');
            console.log(error);
        }
    }

    return {
        //* Propiedades
        activeEvent,
        events,
        hasEventSelected: !!activeEvent,

        //* Metodos
        startDeletingEvent,
        setActiveEvent,
        startSavingEvent,
        startLoadingEvents
    }
}
