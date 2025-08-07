import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import { getMyMeetings } from "../services/calendarService";
import "./CalendarStyles.css";

const CalendarView = () => {
  const [meetings, setMeetings] = useState([]);
  const [hoveredDate, setHoveredDate] = useState(null);

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const data = await getMyMeetings();
        setMeetings(data);
      } catch (error) {
        console.error("Failed to load meetings:", error);
      }
    };

    fetchMeetings();
  }, []);

  const meetingDates = new Set(
    meetings.map((m) => new Date(m.requestedDate || m.date).toDateString())
  );

  const groupMeetingsByDate = (meetings) => {
    const map = {};
    meetings.forEach((m) => {
      const dateStr = new Date(m.requestedDate || m.date).toDateString();
      if (!map[dateStr]) map[dateStr] = [];
      map[dateStr].push(m);
    });
    return map;
  };

  const meetingsByDate = groupMeetingsByDate(meetings);

  // Custom tile to handle mouse events
  const tileContent = ({ date }) => {
    const hasMeeting = meetingDates.has(date.toDateString());
    return (
      <div
        onMouseEnter={() => setHoveredDate(date)}
        onMouseLeave={() => setHoveredDate(null)}
        style={{ width: "100%", height: "100%" }}
      >
        {hasMeeting ? <div className="meeting-dot" /> : null}
      </div>
    );
  };

  const tileClassName = ({ date }) => {
    return meetingDates.has(date.toDateString()) ? "meeting-day" : null;
  };

  // Tooltip logic
  const tooltipMeetings =
    hoveredDate && meetingsByDate[hoveredDate.toDateString()];

  return (
    <div style={{ position: "relative" }}>
      <Calendar tileContent={tileContent} tileClassName={tileClassName} />
      {tooltipMeetings && (
        <div
          className="hover-tooltip"
          style={{ position: "absolute", left: 0, top: "340px", zIndex: 10 }}
        >
          <strong>Meetings on {hoveredDate.toDateString()}:</strong>
          <ul style={{ margin: "8px 0 0 0", padding: 0, listStyle: "none" }}>
            {tooltipMeetings.map((m) => (
              <li key={m.id} style={{ marginBottom: 6 }}>
                <div>
                  <b>{m.title}</b>
                </div>
                <div style={{ fontSize: "0.95em", color: "#bbb" }}>
                  {m.description}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CalendarView;
