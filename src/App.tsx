import React from 'react';  
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';  
import Sidebar from './components/Sidebar';  
import Dashboard from './components/Dashboard';  
import EmployeeTable from './components/EmployeeTable';  

const App: React.FC = () => {  
  return (  
    <Router>  
      <div className="flex">  
        <Sidebar />  {/* Pindahkan Sidebar ke atas agar selalu dilihat */}  
        <div className="flex-grow p-5">  
          <Routes>  
            <Route path="/" element={<Dashboard />} />  
            <Route path="/employees" element={<EmployeeTable />} />  
          </Routes>  
        </div>    
      </div>  
    </Router>  
  );  
};  

export default App; 