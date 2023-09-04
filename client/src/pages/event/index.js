import React, { useState, useEffect } from 'react';
import { Badge, Calendar } from 'antd';

const App = () => {
  const [events, setEvents] = useState([]);
  const [members, setMembers] = useState({});

  useEffect(() => {
    // Fetch events and member details when the component mounts
    getEventsAndMembers();
  }, []);

  const getEventsAndMembers = async () => {
    try {
      // Fetch events from your events API
      const eventsRes = await fetch('http://localhost:4000/event');
      const eventsData = await eventsRes.json();
      setEvents(eventsData);

      // Fetch member details from your members API
      const membersRes = await fetch('http://localhost:4000/member');
      const membersData = await membersRes.json();
      // Create a mapping of member IDs to member details
      const membersMap = {};
      membersData.forEach((member) => {
        membersMap[member._id] = member;
      });
      setMembers(membersMap);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const dateCellRender = (current, listData) => {
    return (
      <ul className="events">
        {listData.map((item) => (
          <li key={item._id}>
            <Badge status="success" text={`${item.eventTitle}: ${members[item.assignedTo]?.fullName || 'Unknown Member'}`} />
          </li>
        ))}
      </ul>
    );
  };

  // ... Rest of your component code

  return (
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
  );
};

export default App;