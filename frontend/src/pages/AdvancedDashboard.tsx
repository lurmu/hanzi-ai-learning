"""Advanced Learning Dashboard"""
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { aiService } from '../services/aiService'
import { learningService } from '../services/learningService'
import ProgressChart from '../components/ProgressChart'
import { motion } from 'framer-motion'
import { TrendingUp, AlertCircle, CheckCircle, Lightbulb } from 'lucide-react'

const AdvancedDashboard: React.FC = () => {
  const navigate = useNavigate()
  const { userId, isAuthenticated } = useAuthStore()
  const [dailyAnalysis, setDailyAnalysis] = useState<any>(null)
  const [suggestions, setSuggestions] = useState<any>(null)
  const [levelUpPrediction, setLevelUpPrediction] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login')
      return
    }

    const fetchData = async () => {
      try {
        if (userId) {
          // 获取每日分析
          const analysis = await aiService.analyzeProgress(userId)
          setDailyAnalysis(analysis)

          // 获取学习建议
          const sug = await aiService.getRecommendations(userId)
          setSuggestions(sug)

          // 获取升级预测
          const prediction = await aiService.getRecommendations(userId)
          setLevelUpPrediction(prediction)
        }
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [userId, isAuthenticated, navigate])

  if (loading) {
    return <div className="flex justify-center items-center h-full">分析中...</div>
  }

  return (
    <div className="p-6 space-y-6">
      {/* 每日分析卡片 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-lg p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <CheckCircle className="text-green-500" size={24} />
          <h2 className="text-2xl font-bold text-gray-800">每日学习分析</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatBox
            label="总尝试次数"
            value={dailyAnalysis?.statistics?.total_attempts || 0}
            color="blue"
          />
          <StatBox
            label="准确率"
            value={`${(dailyAnalysis?.statistics?.accuracy || 0).toFixed(1)}%`}
            color="green"
          />
          <StatBox
            label="错误字数"
            value={dailyAnalysis?.wrong_hanzi?.length || 0}
            color="red"
          />
        </div>
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-gray-700 whitespace-pre-wrap">
            {dailyAnalysis?.ai_analysis}
          </p>
        </div>
      </motion.div>

      {/* 学习建议 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-lg shadow-lg p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <Lightbulb className="text-yellow-500" size={24} />
          <h2 className="text-2xl font-bold text-gray-800">AI学习建议</h2>
        </div>
        <div className="p-4 bg-yellow-50 rounded-lg">
          <p className="text-gray-700 whitespace-pre-wrap">
            {suggestions?.suggestions}
          </p>
        </div>
      </motion.div>

      {/* 升级预测 */}
      {levelUpPrediction && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`rounded-lg shadow-lg p-6 ${
            levelUpPrediction.can_upgrade
              ? 'bg-gradient-to-r from-green-50 to-emerald-50'
              : 'bg-gradient-to-r from-orange-50 to-yellow-50'
          }`}
        >
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp
              className={levelUpPrediction.can_upgrade ? 'text-green-500' : 'text-orange-500'}
              size={24}
            />
            <h2 className="text-2xl font-bold text-gray-800">升级预测</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600 text-sm">当前等级</p>
              <p className="text-3xl font-bold text-gray-800">
                Level {levelUpPrediction.current_level}
              </p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">准确率</p>
              <p className="text-3xl font-bold text-blue-600">
                {levelUpPrediction.accuracy?.toFixed(1) || 0}%
              </p>
            </div>
          </div>
          <div className="mt-4 p-4 bg-white rounded-lg">
            <p className="text-lg font-semibold text-gray-800">
              {levelUpPrediction.message}
            </p>
          </div>
        </motion.div>
      )}
    </div>
  )
}

interface StatBoxProps {
  label: string
  value: string | number
  color: 'blue' | 'green' | 'red'
}

const StatBox: React.FC<StatBoxProps> = ({ label, value, color }) => {
  const colors = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    red: 'bg-red-50 text-red-600',
  }

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={`p-4 rounded-lg ${colors[color]}`}
    >
      <p className="text-sm text-gray-600 mb-2">{label}</p>
      <p className="text-3xl font-bold">{value}</p>
    </motion.div>
  )
}

export default AdvancedDashboard
