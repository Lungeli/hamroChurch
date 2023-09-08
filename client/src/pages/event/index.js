import React, { useState, useEffect } from 'react';
import { Badge, Calendar } from 'antd';
import Header from '@/components/Header';

const App = () => {
  const [events, setEvents] = useState([]);
  const [members, setMembers] = useState({});

  useEffect(() => {
    getEvents();
  }, []);

  const getEvents = async () => {
    try {
      // Fetch events from your events API
      const eventsRes = await fetch('http://localhost:4000/event');
      const eventsData = await eventsRes.json();
      setEvents(eventsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const dateCellRender = (current, listData) => {
    return (
      <ul className="events">
        {listData.map((item) => (
          <li key={item._id}>
            <Badge status="success" text={`${item.eventTitle}: ${item.assignedTo}`} />
          </li>
        ))}
      </ul>
    );
  };



  return (
    <>
     <Header/>
    <Calendar
      cellRender={(current, info) => {
        if (info.type === 'date') {
          const listData = events.filter((event) => {
            const eventDate = new Date(event.startDate);
            return (
              eventDate.getFullYear() === current.year() &&
              eventDate.getMonth() === current.month() &&
              eventDate.getDate() === current.date()
            );
          });
          return dateCellRender(current, listData);
        }
        if (info.type === 'month') return monthCellRender(current);
        return info.originNode;
        
      }}
    />
    </>
   
  );
};

export default App;