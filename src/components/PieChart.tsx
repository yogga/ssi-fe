import React from 'react';  
import { PieChart, Pie, Cell, Tooltip } from 'recharts';  

interface PieChartData {  
  name: string;  
  value: number;  
}  

interface CustomPieChartProps {  
  data: PieChartData[];  
}  

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#00C8FF']; // tambah warna untuk department lain 

const CustomPieChart: React.FC<CustomPieChartProps> = ({ data }) => {  
  return (  
    <PieChart width={600} height={600}>  
      <Pie   
        data={data}   
        cx={300}   
        cy={300}   
        label   
        outerRadius={150}   
        fill="#8884d8"  
      >  
        {data.map((entry, index) => (  
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />  
        ))}  
      </Pie>  
      <Tooltip />  
    </PieChart>  
  );  
};  

export default CustomPieChart;