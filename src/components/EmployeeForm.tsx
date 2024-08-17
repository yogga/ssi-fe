import React, { useState, useEffect } from 'react';

const EmployeeForm = ({ employee, onClose, refreshEmployees }) => {
  const [formData, setFormData] = useState({
    name: '',
    employeeNumber: '',
    position: '',
    department: 'IT',
    dateJoined: new Date().toISOString(),
    photo: null,
    status: 'Tetap',
  });

  const [photo, setPhoto] = useState(null);
  const [notificationVisible, setNotificationVisible] = useState(false);

  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name || '',
        employeeNumber: employee.number || '',
        position: employee.position || '',
        department: employee.department || 'IT',
        dateJoined: employee.dateJoined || new Date().toISOString(),
        photo: employee.photo || null,
        status: employee.status || 'Tetap',
      });
      setPhoto(employee.photo || null);
    }
  }, [employee]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'photo') {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPhoto(reader.result);
        };
        reader.readAsDataURL(file);
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      employeeNumber: '',
      position: '',
      department: 'IT',
      dateJoined: new Date().toISOString(),
      photo: null,
      status: 'Tetap',
    });
    setPhoto(null);
    setNotificationVisible(false);
    onClose(); // Menutup form
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const body = {
      name: formData.name,
      position: formData.position,
      department: formData.department,
      dateJoined: formData.dateJoined,
      photo: photo,
      status: formData.status,
    };

    
    if (!employee) {
      body.number = formData.employeeNumber;
    }

    try {
      const method = employee ? 'PUT' : 'POST';
      const url = employee
        ? `http://localhost:3000/employees/${employee.id}`
        : 'http://localhost:3000/employees';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error('Error in network response');
      }

      const data = await response.json();
      console.log('Success:', data);
      setNotificationVisible(true);

      setTimeout(() => {
        refreshEmployees(); // Refresh data karyawan
        onClose(); 
      }, 2000);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="mt-5">
      <h2 className="text-lg font-bold">{employee ? 'Edit Karyawan' : 'Form Input Karyawan'}</h2>
      {notificationVisible && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mt-4">
          <strong className="font-bold">Form Terkirim</strong>
          <span className="block sm:inline"> ✔️</span>
        </div>
      )}
      <form className="bg-white p-5 shadow rounded" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Nama Karyawan</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="border rounded w-full p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Nomor Karyawan</label>
          <input
            type="text"
            name="employeeNumber"
            value={formData.employeeNumber}
            onChange={handleChange}
            disabled={!!employee} // Hanya disable jika sedang mengedit
            className={`border rounded w-full p-2 ${employee ? 'bg-gray-100 cursor-not-allowed' : ''}`}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Jabatan</label>
          <input
            type="text"
            name="position"
            value={formData.position}
            onChange={handleChange}
            className="border rounded w-full p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Departemen</label>
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            className="border rounded w-full p-2"
          >
            <option>IT</option>
            <option>Finance</option>
            <option>HR</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="border rounded w-full p-2"
          >
            <option>Tetap</option>
            <option>Kontrak</option>
            <option>Probation</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Foto</label>
          <input
            type="file"
            name="photo"
            onChange={handleChange}
            className="border rounded w-full p-2"
            accept="image/*"
          />
          {photo && (
            <div className="mt-2">
              <img src={photo} alt="Preview" className="w-32 h-32 border rounded" />
            </div>
          )}
        </div>
        <div className="flex justify-between">
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            {employee ? 'Update' : 'Submit'}
          </button>
          <button type="button" onClick={handleCancel} className="bg-red-500 text-white px-4 py-2 rounded">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeForm;
