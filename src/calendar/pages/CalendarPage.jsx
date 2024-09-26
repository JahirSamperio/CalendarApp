import { useState } from 'react';
import { Calendar } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css';

import { addHours } from 'date-fns'
import { Navbar, CalendarEvent, CalendarModal } from '../'

import { localizer, getMessagesES } from '../../helpers';
import { useUiStore, useCalendarStore } from '../../hooks';

const events = [{
  title: 'Cumpleaños del jefe',
  notes: 'Hay que comprar pastel',
  start: new Date(),
  end: addHours( new Date(), 2 ),
  bgColor: '#fafafa',
  user: {
    _id: '123',
    name: 'Samperio'
  }
}]

export const CalendarPage = () => {

  const { openDateModal } = useUiStore();
  const { events, setActiveEvent } = useCalendarStore();

  const [lastView, setLastView] = useState(localStorage.getItem('lastView') || 'week')


  //Le da estilos al evento seleccionado
  const eventStyleGetter = (event, start, end, isSelected) => {    
    const style = {
      backgroundColor: '#327CF7',
      borderRadius: '0px',
      opacity: 0.8,
      color: 'white'
    }

    return {
      style
    }
  }

  const onDoubleClick = (event) => {
    console.log({doubleClick: event})
    openDateModal();
  }

  const onSelect = (event) => {
    // console.log({click: event})
    setActiveEvent(event)
  }

  const onViewChanged = (event) => {
    localStorage.setItem('lastView', event);
  }

  return (
    <>
      <Navbar />

      <Calendar
        culture='es'
        localizer={localizer}
        events={events}
        defaultView={lastView}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 'calc( 100vh - 80px)' }}
        messages={getMessagesES()}
        eventPropGetter={eventStyleGetter}
        components={{
          event: CalendarEvent
        }}
        onDoubleClickEvent={ onDoubleClick }
        onSelectEvent={onSelect}
        onView={onViewChanged}
      />

      <CalendarModal />

    </>
  )
}
