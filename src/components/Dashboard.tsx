import React, { useEffect, useState } from 'react';  
import axios from 'axios';     
import PieChart from './PieChart';  

const Dashboard: React.FC = () => {  
  const [employees, setEmployees] = useState([]);  

  useEffect(() => {  
    const fetchEmployees = async () => {  
      try {  
        const response = await axios.get('http://localhost:3000/employees/');   
        setEmployees(response.data);  
      } catch (error) {  
        console.error("Error fetching employees:", error);  
      }  
    };  
    fetchEmployees();  
  }, []);  

   
  const kontrakCount = employees.filter(emp => emp.status === 'Kontrak').length;  
  const probationCount = employees.filter(emp => emp.status === 'Probation').length;  

    
  const departmentCounts = employees.reduce((acc, emp) => {  
    const department = emp.department; 
    if (department) {  
      acc[department] = (acc[department] || 0) + 1;  
    }  
    return acc;  
  }, {});  

    
  const pieChartData = Object.entries(departmentCounts).map(([department, count]) => ({  
    name: department,  
    value: count,  
  }));  

  return (  
    <div className="flex">  
      {/* <Sidebar />   */}  
      <div className="flex-1 p-5">  
        <h1 className="text-2xl font-bold">Halaman Karyawan</h1>  
        <div className="grid grid-cols-3 gap-4 mt-5">  
          <div className="bg-gray-200 p-5 shadow rounded">  
            <h2 className="text-lg">Total Karyawan: {employees.length}</h2>  
          </div>  
          <div className="bg-gray-200 p-5 shadow rounded">  
            <h2 className="text-lg">Kontrak: {kontrakCount}</h2>  
          </div>  
          <div className="bg-gray-200 p-5 shadow rounded">  
            <h2 className="text-lg">Probation: {probationCount}</h2>  
          </div>  
        </div>  
        <div className="mt-5">  
          <PieChart data={pieChartData} />  
        </div>  
      </div>  
    </div>  
  );  
};  

export default Dashboard;