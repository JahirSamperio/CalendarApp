import { parseISO } from "date-fns"

export const convertEventsToDateEvents = ( eventos = []) => {
    return eventos.map( evento => {

        evento.end = parseISO(evento.end)
        evento.start = parseISO(evento.start)

        return evento;
    })
}