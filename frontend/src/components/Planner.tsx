import React, { useState, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import axios from "axios";
import dayjs from "dayjs";
import Navbar from "./Navbar";

type PlannerEntry = {
  _id: string;
  date: string;
  doctorName: string;
};

const Planner: React.FC = () => {
  const [showNavbar, setShowNavbar] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY.current && window.scrollY > 60) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }
      lastScrollY.current = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const [entries, setEntries] = useState<PlannerEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [newDoctorName, setNewDoctorName] = useState("");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [popoverPosition, setPopoverPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);

  // Fetch entries (optionally filtered by doctor name)

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(
        search
          ? `https://digitaldiary-c5on.onrender.com/api/planner?doctorName=${encodeURIComponent(
              search
            )}`
          : "https://digitaldiary-c5on.onrender.com/api/planner",
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => setEntries(res.data));
  }, [search]);

  // Add entry

  const handleAddEntry = () => {
    if (!selectedDate || !newDoctorName) return;
    const token = localStorage.getItem("token");
    axios
      .post(
        "https://digitaldiary-c5on.onrender.com/api/planner",
        {
          date: selectedDate,
          doctorName: newDoctorName,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        setShowModal(false);
        setNewDoctorName("");
        setSelectedDate(null);
        axios
          .get("https://digitaldiary-c5on.onrender.com/api/planner", {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => setEntries(res.data));
      });
  };

  // Get appointments for selected day
  const selectedDayEntries = selectedDate
    ? entries.filter((e) => dayjs(e.date).format("YYYY-MM-DD") === selectedDate)
    : [];

  // Delete appointment for selected day

  const handleDeleteAppointment = (id: string) => {
    const token = localStorage.getItem("token");
    axios
      .delete(`https://digitaldiary-c5on.onrender.com/api/planner/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        axios
          .get("https://digitaldiary-c5on.onrender.com/api/planner", {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => setEntries(res.data));
      });
  };

  // Prepare events for FullCalendar
  const events = entries.map((entry) => ({
    title: entry.doctorName,
    date: dayjs(entry.date).format("YYYY-MM-DD"),
    color: "#22c55e",
    textColor: "#fff",
  }));

  // Custom popover open logic for add/delete
  const handleDateClick = (info: any) => {
    setSelectedDate(info.dateStr);
    setShowModal(true);
    // Position popover near clicked cell, but prevent overflow below and right of viewport
    const rect = info.dayEl.getBoundingClientRect();
    const popoverHeight = 320; // px, matches popover style height
    const popoverWidth = 320; // px, matches popover style width
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    let top = rect.top + window.scrollY + rect.height;
    let left = rect.left + window.scrollX;
    // If popover would overflow below viewport, show above cell
    if (top + popoverHeight > window.scrollY + viewportHeight) {
      top = rect.top + window.scrollY - popoverHeight;
    }
    // If popover would overflow right viewport, shift left
    if (left + popoverWidth > window.scrollX + viewportWidth) {
      left =
        rect.left +
        window.scrollX -
        (left + popoverWidth - (window.scrollX + viewportWidth)) -
        16;
      if (left < 0) left = 8; // prevent negative left
    }
    setPopoverPosition({
      top,
      left,
    });
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-700 flex flex-col items-center">
      <div
        className="w-full"
        style={{
          transition: "transform 0.3s",
          transform: showNavbar ? "translateY(0)" : "translateY(-100%)",
          position: "relative",
          zIndex: 100,
        }}
      >
        <Navbar />
      </div>
      <h2 className="text-2xl md:text-4xl font-bold text-white mb-8 mt-24 text-center drop-shadow-lg">
        Planner Calendar
      </h2>
      <div
        className="w-full max-w-5xl mx-auto flex flex-col items-center px-2 md:px-0"
        style={{ minHeight: "80vh" }}
      >
        <input
          type="text"
          placeholder="Search doctor name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full mb-4 p-2 rounded bg-zinc-800 text-white border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <div className="w-full">
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={events}
            height="auto"
            contentHeight="auto"
            dayMaxEvents={3}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,dayGridYear",
            }}
            selectable={true}
            dateClick={handleDateClick}
            eventDisplay="block"
            eventContent={(arg) => (
              <div
                style={{
                  background: arg.event.backgroundColor,
                  color: "#fff",
                  borderRadius: "6px",
                  padding: "2px 4px",
                  fontSize: "0.95rem",
                  marginBottom: "2px",
                  fontWeight: 500,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
                title={arg.event.title}
              >
                {arg.event.title}
              </div>
            )}
          />
        </div>
      </div>
      {/* Add Doctor Popover Widget */}
      {showModal && popoverPosition && (
        <div
          ref={popoverRef}
          style={{
            position: "absolute",
            top: popoverPosition.top,
            left: popoverPosition.left,
            zIndex: 1000,
            background: "#fff",
            borderRadius: "0.75rem",
            boxShadow: "0 2px 16px rgba(0,0,0,0.2)",
            padding: "1.5rem",
            width: "95vw",
            maxWidth: "320px",
            maxHeight: "320px",
            overflowY: "auto",
          }}
        >
          <h3 className="text-lg font-bold mb-2">
            Appointments for {dayjs(selectedDate).format("DD MMM YYYY")}
          </h3>
          <ul className="mb-4">
            {selectedDayEntries.length === 0 ? (
              <li className="text-zinc-400">No appointments found.</li>
            ) : (
              selectedDayEntries.map((entry) => (
                <li
                  key={entry._id}
                  className="flex justify-between items-center mb-2 p-2 rounded bg-zinc-100 text-black"
                >
                  <span className="font-semibold">{entry.doctorName}</span>
                  <button
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    onClick={() => {
                      handleDeleteAppointment(entry._id);
                      setShowModal(false);
                    }}
                  >
                    Delete
                  </button>
                </li>
              ))
            )}
          </ul>
          <input
            type="text"
            placeholder="Doctor Name"
            value={newDoctorName}
            onChange={(e) => setNewDoctorName(e.target.value)}
            className="w-full mb-4 p-2 rounded bg-gray-200"
          />
          <button
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 font-semibold"
            onClick={() => {
              handleAddEntry();
              setShowModal(false);
            }}
          >
            Add
          </button>
          <button
            className="w-full bg-gray-300 text-black py-2 rounded mt-2"
            onClick={() => setShowModal(false)}
          >
            Cancel
          </button>
        </div>
      )}
      {/* Custom FullCalendar styles for white text */}
      <style>{`
        .fc-toolbar-title, .fc-daygrid-day-number {
          color: #fff !important;
        }
        .fc-daygrid-day {
          color: #fff !important;
        }
        .fc-daygrid-day-frame {
          height: 150px;
          display: flex;
          flex-direction: column;
        }
        .fc-daygrid-day.fc-day-today {
          background: #f59e42 !important;
        }
      `}</style>
    </div>
  );
};

export default Planner;
