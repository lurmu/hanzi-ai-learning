import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { hanziService, Hanzi } from '../services/hanziService'
import { learningService } from '../services/learningService'
import HanziCard from '../components/HanziCard'
import { motion } from 'framer-motion'

const LearningPage: React.FC = () => {
  const navigate = useNavigate()
  const { userId, isAuthenticated } = useAuthStore()
  const [hanzi, setHanzi] = useState<Hanzi[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [correct, setCorrect] = useState(0)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login')
      return
    }

    const fetchHanzi = async () => {
      try {
        const data = await hanziService.listHanzi(0, 20, 1)
        setHanzi(data)
      } catch (error) {
        console.error('Failed to fetch hanzi:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchHanzi()
  }, [isAuthenticated, navigate])

  const handleCorrect = async () => {
    if (userId && hanzi[currentIndex]) {
      try {
        await learningService.recordLearning(
          userId,
          hanzi[currentIndex].id,
          true,
          5,
          1,
          0.9
        )
        setCorrect(correct + 1)
        handleNext()
      } catch (error) {
        console.error('Failed to record learning:', error)
      }
    }
  }

  const handleIncorrect = async () => {
    if (userId && hanzi[currentIndex]) {
      try {
        await learningService.recordLearning(
          userId,
          hanzi[currentIndex].id,
          false,
          10,
          1,
          0.3
        )
        handleNext()
      } catch (error) {
        console.error('Failed to record learning:', error)
      }
    }
  }

  const handleNext = () => {
    setTotal(total + 1)
    if (currentIndex < hanzi.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      setCurrentIndex(0)
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-full">加载中...</div>
  }

  if (hanzi.length === 0) {
    return <div className="flex justify-center items-center h-full">暂无汉字数据</div>
  }

  const currentHanzi = hanzi[currentIndex]
  const accuracy = total > 0 ? ((correct / total) * 100).toFixed(1) : '0.0'

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="mb-6 flex justify-between items-center">
        <div className="flex gap-4">
          <span className="text-lg font-semibold text-gray-700">进度: {currentIndex + 1}/{hanzi.length}</span>
          <span className="text-lg font-semibold text-success">准确率: {accuracy}%</span>
        </div>
        <button
          onClick={() => navigate('/dashboard')}
          className="px-4 py-2 bg-secondary text-white rounded-lg hover:opacity-90 transition-opacity"
        >
          查看统计
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <HanziCard
          character={currentHanzi.character}
          pinyin={currentHanzi.pinyin}
          english={currentHanzi.english}
          difficulty={currentHanzi.difficulty_level}
          onCorrect={handleCorrect}
          onIncorrect={handleIncorrect}
        />
      </div>
    </div>
  )
}

export default LearningPage
