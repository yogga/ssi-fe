import React from 'react';  
import { Link } from 'react-router-dom';

const Sidebar: React.FC = () => {  
  return (  
    <div className="bg-gray-800 text-white h-screen w-1/5 p-5">  
      <h2 className="text-lg font-bold">Human Resource</h2>  
      <ul className="mt-5">  
        <li className="py-2 hover:bg-gray-700 cursor-pointer"><Link to="/">Dashboard</Link> </li>  
        <li className="py-2 hover:bg-gray-700 cursor-pointer"><Link to="/employees">Karyawan</Link></li>  
      </ul>  
    </div>  
  );  
};  

export default Sidebar;