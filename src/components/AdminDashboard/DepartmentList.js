import React, { useState, useEffect } from "react";
import {
  getAllDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "../../services/departmentService";

const DepartmentList = () => {
  const [departments, setDepartments] = useState([]);
  const [form, setForm] = useState({ name: "" });
  const [editingId, setEditingId] = useState(null);

  const fetchDepartments = async () => {
    const res = await getAllDepartments();
    setDepartments(res.data);
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await updateDepartment(editingId, form);
    } else {
      await createDepartment(form);
    }
    setForm({ name: "" });
    setEditingId(null);
    fetchDepartments();
  };

  const handleEdit = (dept) => {
    setForm({ name: dept.name });
    setEditingId(dept.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this department?")) {
      await deleteDepartment(id);
      fetchDepartments();
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Departments</h2>

      <form onSubmit={handleSubmit} className="mb-4">
        <input
          className="border p-2 mr-2"
          type="text"
          name="name"
          placeholder="Department Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          {editingId ? "Update" : "Add"}
        </button>
        {editingId && (
          <button
            type="button"
            className="ml-2 bg-gray-500 text-white px-4 py-2 rounded"
            onClick={() => {
              setEditingId(null);
              setForm({ name: "" });
            }}
          >
            Cancel
          </button>
        )}
      </form>

      <ul>
        {departments.map((dept) => (
          <li key={dept.id} className="flex justify-between items-center border-b py-2">
            <span>{dept.name}</span>
            <div>
              <button
                onClick={() => handleEdit(dept)}
                className="bg-yellow-500 text-white px-3 py-1 rounded mr-2"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(dept.id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DepartmentList;
