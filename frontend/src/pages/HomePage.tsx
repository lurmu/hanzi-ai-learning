import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { learningService, LearningStats } from '../services/learningService'
import { motion } from 'framer-motion'
import { BarChart3, Zap, Target, Clock } from 'lucide-react'

const HomePage: React.FC = () => {
  const navigate = useNavigate()
  const { userId, isAuthenticated } = useAuthStore()
  const [stats, setStats] = useState<LearningStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login')
      return
    }

    const fetchStats = async () => {
      try {
        if (userId) {
          const data = await learningService.getStats(userId)
          setStats(data)
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [userId, isAuthenticated, navigate])

  if (loading) {
    return <div className="flex justify-center items-center h-full">加载中...</div>
  }

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        <StatCard
          icon={<Target className="text-primary" />}
          label="已学汉字"
          value={stats?.total_hanzi_learned || 0}
        />
        <StatCard
          icon={<Zap className="text-warning" />}
          label="准确率"
          value={`${(stats?.accuracy_rate || 0).toFixed(1)}%`}
        />
        <StatCard
          icon={<BarChart3 className="text-success" />}
          label="学习等级"
          value={`Level ${stats?.current_level || 1}`}
        />
        <StatCard
          icon={<Clock className="text-secondary" />}
          label="学习时长"
          value={`${Math.floor((stats?.total_study_time || 0) / 60)}分钟`}
        />
      </motion.div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate('/learning')}
        className="w-full bg-gradient-to-r from-primary to-secondary text-white py-4 rounded-lg font-bold text-lg hover:opacity-90 transition-opacity"
      >
        开始学习 →
      </motion.button>
    </div>
  )
}

interface StatCardProps {
  icon: React.ReactNode
  label: string
  value: string | number
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-lg shadow-lg p-6 text-center"
    >
      <div className="flex justify-center mb-4">{icon}</div>
      <p className="text-gray-600 text-sm mb-2">{label}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </motion.div>
  )
}

export default HomePage
