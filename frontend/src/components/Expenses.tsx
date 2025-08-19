import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import axios from "axios";
import dayjs from "dayjs";
import Navbar from "./Navbar";

type Transaction = {
  _id: string;
  date: string;
  type: "received" | "given";
  amount: number;
  description: string;
};

function Expenses() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [, setSidebarOpen] = useState(false);
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{
    type: "received" | "given";
    amount: number;
    description: string;
  }>({
    type: "received",
    amount: 0,
    description: "",
  });

  // Fetch transactions for the visible month
  useEffect(() => {
    const month = dayjs(calendarDate).month();
    const year = dayjs(calendarDate).year();
    axios
      .get(
        `https://digitaldiary-c5on.onrender.com/api/transactions?month=${month}&year=${year}`
      )
      .then((res) => setTransactions(res.data));
  }, []);

  // Global search for all transactions
  const filteredTransactions = search
    ? transactions.filter(
        (tx) =>
          tx.description?.toLowerCase().includes(search.toLowerCase()) ||
          tx.amount.toString().includes(search)
      )
    : selectedDate
    ? transactions.filter((tx) => dayjs(tx.date).isSame(selectedDate, "day"))
    : [];

  // Add transaction
  const handleAddTransaction = (
    type: "received" | "given",
    amount: number,
    description: string
  ) => {
    if (!selectedDate) {
      alert("Please select a date on the calendar before adding an expense.");
      return;
    }
    axios
      .post("https://digitaldiary-c5on.onrender.com/api/transactions", {
        date: selectedDate,
        type,
        amount,
        description,
      })
      .then(() => {
        setSidebarOpen(false);
        setSearch("");
        setSelectedDate(selectedDate);
        // Refetch transactions for the current month
        const month = dayjs(selectedDate).month();
        const year = dayjs(selectedDate).year();
        axios
          .get(
            `https://digitaldiary-c5on.onrender.com/api/transactions?month=${month}&year=${year}`
          )
          .then((res) => setTransactions(res.data));
      });
  };

  // Delete transaction
  const handleDeleteTransaction = (id: string) => {
    axios
      .delete(`https://digitaldiary-c5on.onrender.com/api/transactions/${id}`)
      .then(() => {
        // Refetch transactions for the current month
        if (selectedDate) {
          const month = dayjs(selectedDate).month();
          const year = dayjs(selectedDate).year();
          axios
            .get(
              `https://digitaldiary-c5on.onrender.com/api/transactions?month=${month}&year=${year}`
            )
            .then((res) => setTransactions(res.data));
        }
      });
  };

  // Start editing
  const startEdit = (tx: Transaction) => {
    setEditId(tx._id);
    setEditForm({
      type: tx.type,
      amount: tx.amount,
      description: tx.description,
    });
  };

  // Save edit
  const handleEditTransaction = (id: string) => {
    axios
      .put(`https://digitaldiary-c5on.onrender.com/api/transactions/${id}`, {
        date: selectedDate,
        ...editForm,
      })
      .then(() => {
        setEditId(null);
        setEditForm({ type: "received", amount: 0, description: "" });
        // Refetch transactions for the current month
        if (selectedDate) {
          const month = dayjs(selectedDate).month();
          const year = dayjs(selectedDate).year();
          axios
            .get(
              `https://digitaldiary-c5on.onrender.com/api/transactions?month=${month}&year=${year}`
            )
            .then((res) => setTransactions(res.data));
        }
      });
  };

  // Prepare events for FullCalendar (always from current transactions)
  const events = transactions.map((tx) => ({
    title: `${
      tx.type === "received"
        ? "₹" + tx.amount + " " + tx.description
        : "-₹" + tx.amount + " " + tx.description
    }`,
    date: dayjs(tx.date).format("YYYY-MM-DD"),
    color: tx.type === "received" ? "#22c55e" : "#ef4444",
    textColor: "#fff",
  }));

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-700 flex flex-col items-center">
      <Navbar />
      <h2 className="text-4xl font-bold text-white mb-8 mt-24 text-center drop-shadow-lg">
        Monthly Calendar Expense
      </h2>
      <div className="w-full max-w-7xl mx-auto flex h-[80vh]">
        {/* Calendar Section */}
        <div className="w-2/3 bg-zinc-800 rounded-l-2xl shadow-2xl p-4">
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={events}
            height="100%"
            contentHeight="100%"
            dayMaxEvents={2}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,dayGridYear",
            }}
            selectable={true}
            dateClick={(info) => {
              setSelectedDate(info.dateStr);
              setSidebarOpen(true);
              setEditId(null);
            }}
            eventDisplay="block"
            eventContent={(arg) => (
              <div
                style={{
                  background: arg.event.backgroundColor,
                  color: "#fff",
                  borderRadius: "6px",
                  padding: "2px 4px",
                  fontSize: "0.85rem",
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
            datesSet={(info) => {
              setCalendarDate(info.start);
            }}
          />
        </div>
        {/* Sidebar for details and add/edit/delete expense */}
        <div className="w-1/3 bg-zinc-900 rounded-r-2xl shadow-2xl p-8 flex flex-col justify-start items-center border-l border-zinc-700">
          <h3 className="text-2xl text-white mb-4 text-center">
            {search
              ? `Search Results`
              : selectedDate
              ? `Expenses for ${dayjs(selectedDate).format("DD MMM YYYY")}`
              : "Select a day"}
          </h3>
          <input
            type="text"
            placeholder="Search by description or amount..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full mb-4 p-2 rounded bg-zinc-800 text-white border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <ul className="mb-6 w-full max-h-48 overflow-y-auto">
            {filteredTransactions.length === 0 ? (
              <li className="text-zinc-400 text-center">No expenses found.</li>
            ) : (
              filteredTransactions.map((tx) =>
                editId === tx._id ? (
                  <li
                    key={tx._id}
                    className={`flex flex-col mb-2 p-2 rounded ${
                      tx.type === "received"
                        ? "bg-green-900/40 text-green-300"
                        : "bg-red-900/40 text-red-300"
                    }`}
                  >
                    <form
                      className="flex flex-col gap-2"
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleEditTransaction(tx._id);
                      }}
                    >
                      <select
                        value={editForm.type}
                        onChange={(e) =>
                          setEditForm((f) => ({
                            ...f,
                            type: e.target.value as "received" | "given",
                          }))
                        }
                        className="p-1 rounded bg-zinc-900 text-white"
                      >
                        <option value="received">Received (Green)</option>
                        <option value="given">Given (Red)</option>
                      </select>
                      <input
                        type="number"
                        value={editForm.amount}
                        onChange={(e) =>
                          setEditForm((f) => ({
                            ...f,
                            amount: parseFloat(e.target.value),
                          }))
                        }
                        className="p-1 rounded bg-zinc-900 text-white"
                        required
                      />
                      <input
                        type="text"
                        value={editForm.description}
                        onChange={(e) =>
                          setEditForm((f) => ({
                            ...f,
                            description: e.target.value,
                          }))
                        }
                        className="p-1 rounded bg-zinc-900 text-white"
                      />
                      <div className="flex gap-2">
                        <button
                          type="submit"
                          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 font-semibold"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          className="bg-gray-400 text-black px-3 py-1 rounded"
                          onClick={() => setEditId(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </li>
                ) : (
                  <li
                    key={tx._id}
                    className={`flex justify-between items-center mb-2 p-2 rounded ${
                      tx.type === "received"
                        ? "bg-green-900/40 text-green-300"
                        : "bg-red-900/40 text-red-300"
                    }`}
                  >
                    <span className="font-semibold">
                      {tx.type === "received" ? "Received" : "Given"}
                    </span>
                    <span className="font-bold">₹{tx.amount}</span>
                    <span className="italic">{tx.description}</span>
                    <div className="flex gap-2">
                      <button
                        className="text-xs bg-blue-600 px-2 py-1 rounded text-white hover:bg-blue-700"
                        onClick={() => startEdit(tx)}
                      >
                        Edit
                      </button>
                      <button
                        className="text-xs bg-red-600 px-2 py-1 rounded text-white hover:bg-red-700"
                        onClick={() => handleDeleteTransaction(tx._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                )
              )
            )}
          </ul>
          {/* Add Expense Form */}
          <form
            className="w-full bg-zinc-800 rounded-lg p-4 shadow"
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const type = form.type.value as "received" | "given";
              const amount = parseFloat(form.amount.value);
              const description = form.description.value;
              handleAddTransaction(type, amount, description);
              form.reset();
            }}
          >
            <h4 className="text-lg text-white mb-2 font-semibold">
              Add Expense
            </h4>
            <select
              name="type"
              className="w-full mb-2 p-2 border rounded bg-zinc-900 text-white"
            >
              <option value="received">Received (Green)</option>
              <option value="given">Given (Red)</option>
            </select>
            <input
              name="amount"
              type="number"
              placeholder="Amount"
              className="w-full mb-2 p-2 border rounded bg-zinc-900 text-white"
              required
            />
            <input
              name="description"
              type="text"
              placeholder="Description"
              className="w-full mb-2 p-2 border rounded bg-zinc-900 text-white"
            />
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 mt-2 font-semibold"
            >
              Add
            </button>
          </form>
        </div>
      </div>
      {/* Custom FullCalendar styles */}
      <style>{`
        .fc-daygrid-day {
          min-height: 90px;
        }
        .fc-daygrid-day-number {
          font-size: 1.1rem;
          font-weight: 600;
          color: #fff;
        }
        .fc-daygrid-day.fc-day-today {
          background: #f59e42 !important;
        }
        .fc-daygrid-day.fc-day-selected {
          background: #22c55e !important;
        }
        .fc {
          background: transparent;
          border: none;
        }
        .fc-toolbar-title {
          color: #fff !important;
          font-size: 2rem;
          font-weight: 700;
          letter-spacing: 1px;
          text-shadow: 0 2px 8px rgba(0,0,0,0.3);
        }
        .fc-col-header-cell {
          background: white !important;
          color: black !important;
        }
        .fc-col-header-cell-cushion {
          color: #111 !important;
          font-size: 1.1rem;
          font-weight: 600;
          text-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }
      `}</style>
    </div>
  );
}

export default Expenses;
