// Calendar.jsx
import React, { useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks } from '../features/taskSlice/taskSlice';


const Calendar = () => {
  const token = localStorage.getItem('authToken');

  if (!token) alert('Please login to continue.');

  // Extract username from JWT
  const getUsernameFromToken = (token) => {
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
      return payload.sub || payload.username || null;
    } catch {
      return null;
    }
  };

  const usernameJWT = getUsernameFromToken(token);
  const dispatch = useDispatch();
  const { tasks } = useSelector((state) => state.task);

  // Priority color mapping
  const priorityColors = {
    High: '#dc2626'/10,     // red-600
    Medium: '#facc15',   // yellow-400
    Low: '#22c55e',      // green-500
  };

  // Generate date range array for each task
  const getDateRange = (start, end) => {
    const dates = [];
    let current = new Date(start);
    const endDate = new Date(end);
    while (current <= endDate) {
      dates.push(new Date(current).toISOString().split('T')[0]);
      current.setDate(current.getDate() + 1);
    }
    return dates;
  };

  // Expand each task into daily events
  const events = tasks.flatMap((task) => {
    const taskDates = getDateRange(task.startingDate, task.lastDate);
    return taskDates.map((date) => ({
      id: `${task.taskName}-${task.userName}-${date}`,
      title: `${task.taskName}`,
      start: date,
      allDay: true,
      backgroundColor: priorityColors[task.taskPriority] || '#06b6d4',
      textColor: '#ffffff',
    }));
  });

  // Fetch tasks
  useEffect(() => {
    if (usernameJWT) {
      dispatch(fetchTasks(usernameJWT)).unwrap().catch(console.error);
    }
  }, []);

  return (
    <div className="bg-gray-950 min-h-screen text-white p-6">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        eventColor="#06b6d4"
        headerToolbar={{
          start: 'prev,next today',
          center: 'title',
          end: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
        height="auto"
        eventContent={(arg) => (
          <div
            className="p-1 px-2 rounded-md text-sm font-medium bg-opacity-90"
            style={{
              backgroundColor: arg.backgroundColor,
              color: arg.textColor,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {arg.event.title}
          </div>
        )}
      />
    </div>
  );
};

export default Calendar;