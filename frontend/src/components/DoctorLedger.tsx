import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import { AgGridReact } from "ag-grid-react";
import * as XLSX from "xlsx";
import "../styles/gridStyle.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

const DoctorLedger: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDoctorName, setNewDoctorName] = useState("");
  const [newDoctorLastConsultationDate, setNewDoctorLastConsultationDate] =
    useState("");
  const [newDoctorProductsDiscussed, setNewDoctorProductsDiscussed] =
    useState("");
  const [newDoctorNotes, setNewDoctorNotes] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editDoctor, setEditDoctor] = useState<any>(null);
  const [search, setSearch] = useState("");
  const gridRef = useRef<any>(null);
  // Navbar show/hide on scroll (like Planner)
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

  type Doctor = {
    _id: string;
    name: string;
    lastConsultationDate?: string;
    productsDiscussed?: string;
    notes?: string;
  };

  // Fetch doctors
  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("https://digitaldiary-c5on.onrender.com/api/doctors", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setDoctors(res.data));
  }, []);

  // Add doctor

  const handleAddDoctor = () => {
    if (!newDoctorName) return;
    const token = localStorage.getItem("token");
    axios
      .post(
        "https://digitaldiary-c5on.onrender.com/api/doctors",
        {
          name: newDoctorName,
          lastConsultationDate: newDoctorLastConsultationDate,
          productsDiscussed: newDoctorProductsDiscussed,
          notes: newDoctorNotes,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        setShowAddModal(false);
        setNewDoctorName("");
        setNewDoctorLastConsultationDate("");
        setNewDoctorProductsDiscussed("");
        setNewDoctorNotes("");
        axios
          .get("https://digitaldiary-c5on.onrender.com/api/doctors", {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => setDoctors(res.data));
      });
  };

  // Bulk upload doctors from Excel
  const handleExcelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target!.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      // Find column index for doctor names
      const headerRow = json[0] as string[];
      const nameColIdx = headerRow.findIndex((h) =>
        h.toLowerCase().includes("name")
      );
      if (nameColIdx === -1) {
        alert("No doctor name column found!");
        return;
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // Edit doctor

  const handleEditDoctor = () => {
    if (!editDoctor) return;
    const token = localStorage.getItem("token");
    axios
      .put(
        `https://digitaldiary-c5on.onrender.com/api/doctors/${editDoctor._id}`,
        editDoctor,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        setShowEditModal(false);
        setEditDoctor(null);
        axios
          .get("https://digitaldiary-c5on.onrender.com/api/doctors", {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => setDoctors(res.data));
      });
  };

  // Filter doctors by search string
  const filteredDoctors = search
    ? doctors.filter((doc) =>
        doc.name.toLowerCase().includes(search.toLowerCase())
      )
    : doctors;

  // AG Grid columns
  const columnDefs: import("ag-grid-community").ColDef<Doctor>[] = [
    {
      headerName: "Name",
      field: "name",
      filter: true,
      sortable: true,
      flex: 1,
    },
    {
      headerName: "Last Consultation Date",
      field: "lastConsultationDate",
      filter: true,
      sortable: true,
      flex: 1,
      valueFormatter: (p) =>
        p.value ? new Date(p.value as string).toLocaleDateString() : "",
    },
    {
      headerName: "Product Discussed",
      field: "productsDiscussed",
      filter: true,
      sortable: true,
      flex: 1,
    },
    {
      headerName: "Notes",
      field: "notes",
      filter: true,
      sortable: true,
      flex: 1,
    },
  ];

  // Row click handler
  const onRowClicked = (e: any) => {
    setEditDoctor({ ...e.data });
    setShowEditModal(true);
  };

  // Grid quick filter

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-700">
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
      <div className="mx-auto pt-24 px-2 md:max-w-6xl md:px-0">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
          <h2 className="text-2xl md:text-3xl text-white font-bold text-center md:text-left">
            Doctor Ledger
          </h2>
          <div className="flex flex-col md:flex-row gap-2 md:gap-4 items-center">
            <button
              className="bg-green-600 text-white px-4 py-2 rounded font-semibold w-full md:w-auto"
              onClick={() => setShowAddModal(true)}
            >
              Add Doctor
            </button>
            <label className="bg-blue-600 text-white px-4 py-2 rounded font-semibold cursor-pointer w-full md:w-auto text-center">
              Upload Excel
              <input
                type="file"
                accept=".xlsx,.xls"
                className="hidden"
                onChange={handleExcelUpload}
              />
            </label>
            <input
              type="text"
              placeholder="Search doctors..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-3 py-2 rounded bg-zinc-800 text-white border border-zinc-600 w-full md:w-auto"
            />
          </div>
        </div>
        <div className="ag-theme-alpine-dark" style={{ width: "100%" }}>
          <AgGridReact
            ref={gridRef}
            rowData={filteredDoctors}
            columnDefs={columnDefs}
            pagination={true}
            paginationPageSize={10}
            domLayout="autoHeight"
            onRowClicked={onRowClicked}
            animateRows={true}
            defaultColDef={{ filter: true, sortable: true }}
          />
        </div>
      </div>
      {/* Add Doctor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 w-full max-w-xs md:max-w-md lg:max-w-lg">
            <h3 className="text-lg font-bold mb-2">Add Doctor</h3>
            <input
              type="text"
              placeholder="Doctor Name"
              value={newDoctorName}
              onChange={(e) => setNewDoctorName(e.target.value)}
              className="w-full mb-2 p-2 rounded bg-gray-200"
            />
            <input
              type="date"
              placeholder="Last Consultation Date"
              value={newDoctorLastConsultationDate}
              onChange={(e) => setNewDoctorLastConsultationDate(e.target.value)}
              className="w-full mb-2 p-2 rounded bg-gray-200"
            />
            <input
              type="text"
              placeholder="Product Discussed"
              value={newDoctorProductsDiscussed}
              onChange={(e) => setNewDoctorProductsDiscussed(e.target.value)}
              className="w-full mb-2 p-2 rounded bg-gray-200"
            />
            <input
              type="text"
              placeholder="Notes"
              value={newDoctorNotes}
              onChange={(e) => setNewDoctorNotes(e.target.value)}
              className="w-full mb-4 p-2 rounded bg-gray-200"
            />
            <button
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 font-semibold"
              onClick={handleAddDoctor}
            >
              Add
            </button>
            <button
              className="w-full bg-gray-300 text-black py-2 rounded mt-2"
              onClick={() => setShowAddModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      {/* Edit Doctor Modal */}
      {showEditModal && editDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 w-full max-w-xs md:max-w-md lg:max-w-lg">
            <h3 className="text-lg font-bold mb-2">Edit Doctor</h3>
            <input
              type="text"
              placeholder="Doctor Name"
              value={editDoctor.name}
              onChange={(e) =>
                setEditDoctor({ ...editDoctor, name: e.target.value })
              }
              className="w-full mb-2 p-2 rounded bg-gray-200"
            />
            <input
              type="date"
              value={
                editDoctor.lastConsultationDate
                  ? new Date(editDoctor.lastConsultationDate)
                      .toISOString()
                      .slice(0, 10)
                  : ""
              }
              onChange={(e) =>
                setEditDoctor({
                  ...editDoctor,
                  lastConsultationDate: e.target.value,
                })
              }
              className="w-full mb-2 p-2 rounded bg-gray-200"
            />
            <input
              type="text"
              placeholder="Product Discussed"
              value={editDoctor.productsDiscussed || ""}
              onChange={(e) =>
                setEditDoctor({
                  ...editDoctor,
                  productsDiscussed: e.target.value,
                })
              }
              className="w-full mb-2 p-2 rounded bg-gray-200"
            />
            <input
              type="text"
              placeholder="Notes"
              value={editDoctor.notes || ""}
              onChange={(e) =>
                setEditDoctor({ ...editDoctor, notes: e.target.value })
              }
              className="w-full mb-2 p-2 rounded bg-gray-200"
            />
            <button
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 mt-2 font-semibold"
              onClick={handleEditDoctor}
            >
              Save
            </button>
            <button
              className="w-full bg-gray-300 text-black py-2 rounded mt-2"
              onClick={() => setShowEditModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorLedger;
