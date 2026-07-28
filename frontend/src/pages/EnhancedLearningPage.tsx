"""Enhanced Learning Page with LSRW modes"""
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { learningService } from '../services/learningService'
import { hanziService, Hanzi } from '../services/hanziService'
import DynamicHanziCard from '../components/DynamicHanziCard'
import { motion } from 'framer-motion'
import { Volume2, Mic, BookOpen, Pen, ChevronRight } from 'lucide-react'

type LearningMode = 'listen' | 'speak' | 'read' | 'write'

const EnhancedLearningPage: React.FC = () => {
  const navigate = useNavigate()
  const { userId, isAuthenticated } = useAuthStore()
  const [hanzi, setHanzi] = useState<Hanzi[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [currentMode, setCurrentMode] = useState<LearningMode>('listen')
  const [loading, setLoading] = useState(true)
  const [modeProgress, setModeProgress] = useState<Record<LearningMode, number>>({
    listen: 0,
    speak: 0,
    read: 0,
    write: 0,
  })

  const modes: { id: LearningMode; label: string; icon: React.ReactNode }[] = [
    { id: 'listen', label: '听', icon: <Volume2 size={24} /> },
    { id: 'speak', label: '说', icon: <Mic size={24} /> },
    { id: 'read', label: '读', icon: <BookOpen size={24} /> },
    { id: 'write', label: '写', icon: <Pen size={24} /> },
  ]

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login')
      return
    }

    const fetchHanzi = async () => {
      try {
        const data = await hanziService.listHanzi(0, 10, 1)
        setHanzi(data)
      } catch (error) {
        console.error('Failed to fetch hanzi:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchHanzi()
  }, [isAuthenticated, navigate])

  const handleModeComplete = async (
    mode: string,
    isCorrect: boolean,
    timeSpent: number
  ) => {
    if (userId && hanzi[currentIndex]) {
      try {
        await learningService.recordLearning(
          userId,
          hanzi[currentIndex].id,
          isCorrect,
          timeSpent,
          1,
          isCorrect ? 0.9 : 0.3
        )

        // 更新模式进度
        setModeProgress((prev) => ({
          ...prev,
          [mode]: prev[mode as LearningMode] + 1,
        }))

        // 进入下一个模式或下一个汉字
        const nextModeIndex = modes.findIndex((m) => m.id === currentMode) + 1
        if (nextModeIndex < modes.length) {
          setCurrentMode(modes[nextModeIndex].id)
        } else {
          // 完成所有模式，进入下一个汉字
          if (currentIndex < hanzi.length - 1) {
            setCurrentIndex(currentIndex + 1)
            setCurrentMode('listen')
          } else {
            navigate('/advanced-dashboard')
          }
        }
      } catch (error) {
        console.error('Failed to record learning:', error)
      }
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-full">加载中...</div>
  }

  if (hanzi.length === 0) {
    return <div className="flex justify-center items-center h-full">暂无汉字数据</div>
  }

  const currentHanzi = hanzi[currentIndex]
  const totalModes = modes.length * hanzi.length
  const completedModes = Object.values(modeProgress).reduce((a, b) => a + b, 0)
  const progress = (completedModes / totalModes) * 100

  return (
    <div className="p-6 h-full flex flex-col space-y-6">
      {/* 进度条 */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-2xl font-bold text-gray-800">
            汉字 {currentIndex + 1}/{hanzi.length}
          </h1>
          <span className="text-lg font-semibold text-primary">{progress.toFixed(0)}%</span>
        </div>
        <motion.div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-secondary"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </motion.div>
      </motion.div>

      {/* 学习卡片 */}
      <div className="flex-1 flex items-center justify-center">
        <DynamicHanziCard
          character={currentHanzi.character}
          pinyin={currentHanzi.pinyin}
          english={currentHanzi.english}
          difficulty={currentHanzi.difficulty_level}
          currentMode={currentMode}
          onModeComplete={handleModeComplete}
        />
      </div>

      {/* 学习模式指示 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-center gap-2"
      >
        {modes.map((mode, index) => (
          <motion.div
            key={mode.id}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
              currentMode === mode.id
                ? 'bg-gradient-to-r from-primary to-secondary text-white'
                : modeProgress[mode.id] > 0
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            {mode.icon}
            <span>{mode.label}</span>
            {modeProgress[mode.id] > 0 && (
              <span className="ml-2 text-sm">✓ {modeProgress[mode.id]}</span>
            )}
            {index < modes.length - 1 && currentMode === mode.id && (
              <ChevronRight size={16} />
            )}
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

export default EnhancedLearningPage
