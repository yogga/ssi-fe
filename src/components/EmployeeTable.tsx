import React, { useEffect, useState } from 'react';  
import axios from 'axios';  
import { CSVLink } from 'react-csv';  
import jsPDF from 'jspdf';  
import autoTable from 'jspdf-autotable';  
import EmployeeForm from './EmployeeForm';
import { FaEdit, FaTrash } from 'react-icons/fa';

interface Employee {  
  id: number;  
  name: string;  
  number: string;  
  position: string;  
  department: string;  
  dateJoined: string;  
  status: string;  
  photo: string;  
}  

const EmployeeTable: React.FC = () => {  
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);  
  const [currentPage, setCurrentPage] = useState(1);  
  const [employeesPerPage] = useState(10);  
  const [loading, setLoading] = useState(true);    
  const totalPages = Math.ceil(filteredEmployees.length / employeesPerPage);  
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');  
  const [statusFilter, setStatusFilter] = useState<string>('all');  
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');  
  const [showForm, setShowForm] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);


  const fetchEmployees = async () => {  
    try {  
      const response = await axios.get('http://localhost:3000/employees/');  
      setEmployees(response.data);
      setFilteredEmployees(response.data);  
    } catch (error) {  
      console.error('Error fetching employee data:', error);  
    } finally {  
      setLoading(false);  
    }  
  };
  useEffect(() => {    

    fetchEmployees();  
  }, []); 
  
  useEffect(() => {  
    filterAndSortEmployees();  
  }, [departmentFilter, statusFilter, sortOrder, employees]);

  const filterAndSortEmployees = () => {  
    let updatedEmployees = [...employees];  

    // Filter by department  
    if (departmentFilter !== 'all') {  
      updatedEmployees = updatedEmployees.filter(  
        employee => employee.department === departmentFilter  
      );  
    }  

    // Filter by status  
    if (statusFilter !== 'all') {  
      updatedEmployees = updatedEmployees.filter(  
        employee => employee.status.toLowerCase() === statusFilter.toLowerCase()  
      );  
    }
    
    // Sort by name  
    updatedEmployees.sort((a, b) => {  
      const nameA = a.name.toLowerCase();  
      const nameB = b.name.toLowerCase();  
      if (sortOrder === 'asc') {  
        return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;  
      } else {  
        return nameA > nameB ? -1 : nameA < nameB ? 1 : 0;  
      }  
    });  

    setFilteredEmployees(updatedEmployees);  
    setCurrentPage(1);  
  }; 
  
  const handleDepartmentChange = (event: React.ChangeEvent<HTMLSelectElement>) => {  
    setDepartmentFilter(event.target.value);  
  };  

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {  
    setStatusFilter(event.target.value);  
  };  

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {  
    setSortOrder(event.target.value as 'asc' | 'desc');  
  }; 

  const handleAddEmployee = () => {
      setCurrentEmployee(null);  
      setShowForm(true); 
  };
  

  const handleEditEmployee = async (id: number) => {  
    try {
      const response = await axios.get(`http://localhost:3000/employees/${id}`);  
      setCurrentEmployee(response.data); 
      setShowForm(true); 
    } catch (error) {
      console.error('Error fetching employee data:', error);
    }
  };
  
  
  const handleDeleteEmployee = async (id: number) => {  
    if (window.confirm("Are you sure you want to delete this employee?")) {  
      await fetch(`http://localhost:3000/employees/${id}`, {  
        method: 'DELETE',  
      });  
       
      setEmployees(employees.filter(employee => employee.id !== id));  
    }  
  };  

  const handleExportPDF = () => {  
    const doc = new jsPDF();  
    autoTable(doc, { html: '#employee-table' });  
    doc.save('employees.pdf');  
  };  

  const handleImportCSV = (event: React.ChangeEvent<HTMLInputElement>) => {  
    const file = event.target.files?.[0];  
    if (file) {  
      const reader = new FileReader();  
      reader.onload = (e) => {  
        const text = e.target?.result as string;  
        const rows = text.split('\n').map(row => row.split(','));  
        const importedEmployees = rows.map((row, index) => ({  
          id: index + 1,  
          name: row[0],  
          number: row[1],  
          position: row[2],  
          department: row[3],  
          dateJoined: row[4],  
          status: row[5],  
          photo: row[6],  
        }));  
        setEmployees([...employees, ...importedEmployees]);  
      };  
      reader.readAsText(file);  
    }  
  };  

  const indexOfLastEmployee = currentPage * employeesPerPage;  
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;  
  const currentEmployees = filteredEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee);  

  const handlePageChange = (pageNumber: number) => {  
    setCurrentPage(pageNumber);  
  };  

  if (loading) {  
    return <p>Loading...</p>;  
  }else {
    <p>No Data Available</p>
  }  

  return (  
    <div className="mt-5">
      {!showForm && (  
      <h1 className="text-2xl font-bold mb-4">Data Karyawan</h1>
      )}
      {!showForm && ( 
        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-4">  
              <button className='bg-blue-500 text-white px-4 py-2 rounded mb-4 ml-4 mr-4' onClick={handleAddEmployee}>
                Tambah Karyawan
              </button>  

              <label htmlFor="import-csv" className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer mb-4 ml-4 mr-4">
              Import CSV
              </label>
              <input 
                id="import-csv" 
                type="file" 
                accept=".csv" 
                className="hidden" 
                onChange={handleImportCSV} 
              />

              <CSVLink data={employees} filename="employees.csv" >  
                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200 mb-4 ml-4 mr-4">
                  Ekspor ke CSV
                </button>  
              </CSVLink> 

              <button className='bg-blue-500 text-white px-4 py-2 rounded mb-4 ml-4 mr-4' onClick={handleExportPDF}>
                Ekspor ke PDF
              </button>
          </div>
          <div className="flex space-x-2"> 
              <select 
                value={sortOrder}
                onChange={handleSortChange}
                className="border border-gray-300 rounded p-2"
              >  
                <option value="asc">Sort Ascending</option>  
                <option value="desc">Sort Descending</option>  
              </select>  

              <select 
                value={departmentFilter}
                onChange={handleDepartmentChange}
                className="border border-gray-300 rounded p-2"
              >  
                <option value="all">Semua Departemen</option>  
                <option value="Finance">Finance</option>  
                <option value="HR">HR</option>  
                <option value="IT">IT</option>    
              </select>  

              <select 
                value={statusFilter}
                onChange={handleStatusChange}
                className="border border-gray-300 rounded p-2"
              >  
                <option value="all">Semua Status</option>  
                <option value="tetap">Tetap</option>  
                <option value="kontrak">Kontrak</option>  
                <option value="probation">Probation</option>  
              </select>  
        </div>
      </div>
       )}
      {showForm ? (  
        <EmployeeForm employee={currentEmployee} onClose={() => setShowForm(false)} refreshEmployees={fetchEmployees} />  
      ) : (  
        <div>
      <table id="employee-table" className="min-w-full bg-white border border-gray-300">  
        <thead>  
          <tr>  
            <th className="border px-4 py-2">Nama Karyawan</th>  
            <th className="border px-4 py-2">Nomor Karyawan</th>  
            <th className="border px-4 py-2">Jabatan</th>  
            <th className="border px-4 py-2">Departemen</th>  
            <th className="border px-4 py-2">Tanggal Masuk</th>  
            <th className="border px-4 py-2">Foto</th>  
            <th className="border px-4 py-2">Status</th>  
            <th className="border px-4 py-2">Aksi</th>  
          </tr>  
        </thead>  
        <tbody>  
          {currentEmployees.map((employee) => (  
            <tr key={employee.id}>  
              <td className="border px-4 py-2">{employee.name}</td>  
              <td className="border px-4 py-2">{employee.number}</td>  
              <td className="border px-4 py-2">{employee.position}</td>  
              <td className="border px-4 py-2">{employee.department}</td>  
              <td className="border px-4 py-2">{employee.dateJoined}</td>  
              {/* <td className="border px-4 py-2"><img src={employee.photo} alt={employee.name} /></td> */}
              <td className="border px-4 py-2">  
                <img src={employee.photo} alt={employee.name} className="w-10 h-10 rounded-full" />  
              </td>  
              <td className="border px-4 py-2">  
                {/* <span className={`status ${employee.status.toLowerCase()}`}>{employee.status}</span>   */}
                  <span
                  className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${
                    employee.status === 'Tetap'
                      ? 'bg-blue-500 text-white'
                      : employee.status === 'Kontrak'
                      ? 'bg-yellow-500 text-white'
                      : 'bg-green-500 text-white'
                  }`}
                >
                  {employee.status}
                </span>
              </td>  
              <td className="border px-4 py-2">  

                 <button
                onClick={() => handleEditEmployee(employee.id)}
                className="text-blue-500 hover:text-blue-700 mr-3"
              >
                <FaEdit />
              </button>
              <button
                onClick={() => handleDeleteEmployee(employee.id)}
                className="text-red-500 hover:text-red-700"
              >
                <FaTrash />
              </button>
              </td>  
            </tr>  
          ))}  
        </tbody>  
      </table>  

      <div className="mt-4">  
        {Array.from({ length: totalPages }, (_, i) => (  
          <button  
            key={i + 1}  
            className={`mx-1 px-3 py-1 border ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-white'}`}  
            onClick={() => handlePageChange(i + 1)}  
          >  
            {i + 1}  
          </button>  
        ))}  
      </div>  
    </div> 
    )}
  </div>  
  );  
};  

export default EmployeeTable;
