import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface ProgressChartProps {
  data: Array<{ date: string; accuracy: number; count: number }>
}

const ProgressChart: React.FC<ProgressChartProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">学习进度</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="accuracy" stroke="#FF6B6B" name="准确率" />
          <Line type="monotone" dataKey="count" stroke="#4ECDC4" name="学习数量" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default ProgressChart
