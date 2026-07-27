import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { aiService, AIAnalysis } from '../services/aiService'
import ProgressChart from '../components/ProgressChart'
import { motion } from 'framer-motion'

const DashboardPage: React.FC = () => {
  const navigate = useNavigate()
  const { userId, isAuthenticated } = useAuthStore()
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login')
      return
    }

    const fetchAnalysis = async () => {
      try {
        if (userId) {
          const data = await aiService.analyzeProgress(userId)
          setAnalysis(data)
        }
      } catch (error) {
        console.error('Failed to fetch analysis:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalysis()
  }, [userId, isAuthenticated, navigate])

  if (loading) {
    return <div className="flex justify-center items-center h-full">AI分析中...</div>
  }

  const mockChartData = [
    { date: '周一', accuracy: 75, count: 10 },
    { date: '周二', accuracy: 80, count: 12 },
    { date: '周三', accuracy: 85, count: 15 },
    { date: '周四', accuracy: 82, count: 14 },
    { date: '周五', accuracy: 90, count: 18 },
  ]

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"
      >
        <div className="lg:col-span-1 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">统计数据</h3>
          <div className="space-y-4">
            <div>
              <p className="text-gray-600 text-sm">总尝试次数</p>
              <p className="text-2xl font-bold text-primary">{analysis?.statistics.total_attempts}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">准确率</p>
              <p className="text-2xl font-bold text-success">{analysis?.statistics.accuracy.toFixed(1)}%</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">正确次数</p>
              <p className="text-2xl font-bold text-secondary">{analysis?.statistics.correct_attempts}</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">AI分析</h3>
          <div className="text-gray-700 whitespace-pre-wrap text-sm">
            {analysis?.analysis}
          </div>
        </div>
      </motion.div>

      <ProgressChart data={mockChartData} />
    </div>
  )
}

export default DashboardPage
