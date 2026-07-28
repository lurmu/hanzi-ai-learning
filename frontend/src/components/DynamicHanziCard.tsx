"""Dynamic Hanzi Card Component with animations"""
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Volume2, Pen, BookOpen, Mic } from 'lucide-react'

interface DynamicHanziCardProps {
  character: string
  pinyin: string
  english: string
  difficulty: number
  currentMode: 'listen' | 'speak' | 'read' | 'write'
  onModeComplete: (mode: string, isCorrect: boolean, timeSpent: number) => void
}

const DynamicHanziCard: React.FC<DynamicHanziCardProps> = ({
  character,
  pinyin,
  english,
  difficulty,
  currentMode,
  onModeComplete,
}) => {
  const [isFlipped, setIsFlipped] = useState(false)
  const [startTime, setStartTime] = useState<number>(Date.now())
  const [showHint, setShowHint] = useState(false)
  const [userInput, setUserInput] = useState('')

  const modes = [
    { id: 'listen', label: '听', icon: Volume2, color: 'text-blue-500' },
    { id: 'speak', label: '说', icon: Mic, color: 'text-green-500' },
    { id: 'read', label: '读', icon: BookOpen, color: 'text-purple-500' },
    { id: 'write', label: '写', icon: Pen, color: 'text-red-500' },
  ]

  const handleCorrect = () => {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000)
    onModeComplete(currentMode, true, timeSpent)
  }

  const handleIncorrect = () => {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000)
    onModeComplete(currentMode, false, timeSpent)
  }

  const playAudio = () => {
    // 使用Web Speech API播放发音
    const utterance = new SpeechSynthesisUtterance(pinyin)
    utterance.lang = 'zh-CN'
    window.speechSynthesis.speak(utterance)
  }

  const getModeDescription = () => {
    switch (currentMode) {
      case 'listen':
        return '👂 听音识字 - 点击播放，选择正确的字'
      case 'speak':
        return '🗣️ 读音跟读 - 跟随发音，练习正确读法'
      case 'read':
        return '📖 阅读理解 - 阅读字义和用法'
      case 'write':
        return '✏️ 笔画书写 - 按笔顺书写汉字'
      default:
        return ''
    }
  }

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0, rotateY: -20 }}
      animate={{ scale: 1, opacity: 1, rotateY: 0 }}
      exit={{ scale: 0.8, opacity: 0, rotateY: 20 }}
      className="w-full max-w-2xl mx-auto"
    >
      {/* 学习模式指示器 */}
      <div className="flex justify-center gap-3 mb-6">
        {modes.map((mode) => {
          const Icon = mode.icon
          const isActive = currentMode === mode.id
          return (
            <motion.div
              key={mode.id}
              animate={{
                scale: isActive ? 1.2 : 1,
                opacity: isActive ? 1 : 0.5,
              }}
              className={`flex flex-col items-center p-2 rounded-lg cursor-pointer transition-all ${
                isActive ? 'bg-yellow-100' : 'bg-gray-100'
              }`}
            >
              <Icon className={`${mode.color} w-6 h-6`} />
              <span className="text-xs font-bold mt-1">{mode.label}</span>
            </motion.div>
          )
        })}
      </div>

      {/* 模式描述 */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center text-lg font-semibold text-gray-700 mb-6"
      >
        {getModeDescription()}
      </motion.div>

      {/* 主卡片 */}
      <motion.div
        onClick={() => currentMode !== 'write' && setIsFlipped(!isFlipped)}
        className="bg-white rounded-2xl shadow-2xl p-12 cursor-pointer mb-8 relative overflow-hidden"
        whileHover={{ boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}
      >
        {/* 背景装饰 */}
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 to-red-50 opacity-50" />

        <AnimatePresence mode="wait">
          {!isFlipped ? (
            <motion.div
              key="front"
              initial={{ rotateY: -90 }}
              animate={{ rotateY: 0 }}
              exit={{ rotateY: 90 }}
              className="text-center relative z-10"
            >
              {currentMode === 'listen' ? (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation()
                    playAudio()
                  }}
                  className="mb-6 p-4 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                >
                  <Volume2 size={40} />
                </motion.button>
              ) : null}

              <motion.div
                className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-500 mb-6"
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              >
                {character}
              </motion.div>

              {currentMode !== 'listen' && (
                <>
                  <p className="text-3xl font-semibold text-gray-600 mb-2">{pinyin}</p>
                  <p className="text-xl text-gray-500">{english}</p>
                </>
              )}

              {currentMode === 'listen' && (
                <p className="text-gray-500 text-sm mt-4">点击卡片查看答案</p>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="back"
              initial={{ rotateY: -90 }}
              animate={{ rotateY: 0 }}
              exit={{ rotateY: 90 }}
              className="text-center relative z-10 space-y-4"
            >
              <p className="text-sm text-gray-600">拼音</p>
              <p className="text-3xl font-bold text-blue-600">{pinyin}</p>
              <p className="text-sm text-gray-600 mt-6">释义</p>
              <p className="text-2xl font-semibold text-gray-800">{english}</p>
              <div className="flex justify-center gap-1 mt-6">
                {Array.from({ length: difficulty }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 rounded-full bg-yellow-500"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{
                      duration: 1.5,
                      delay: i * 0.1,
                      repeat: Infinity,
                    }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* 笔画书写模式 */}
      {currentMode === 'write' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8 bg-gray-50 p-6 rounded-xl"
        >
          <p className="text-sm text-gray-600 mb-4">请按笔顺书写汉字</p>
          <canvas
            className="w-full h-64 bg-white border-2 border-gray-300 rounded-lg cursor-crosshair"
            id="canvas"
          />
          <button
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            onClick={() => {
              const canvas = document.getElementById('canvas') as HTMLCanvasElement
              const ctx = canvas.getContext('2d')
              ctx?.clearRect(0, 0, canvas.width, canvas.height)
            }}
          >
            清除
          </button>
        </motion.div>
      )}

      {/* 按钮组 */}
      <div className="flex gap-4 justify-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCorrect}
          className="px-8 py-4 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-lg font-bold text-lg hover:shadow-lg transition-all"
        >
          ✓ 正确
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleIncorrect}
          className="px-8 py-4 bg-gradient-to-r from-red-400 to-pink-500 text-white rounded-lg font-bold text-lg hover:shadow-lg transition-all"
        >
          ✗ 错误
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowHint(!showHint)}
          className="px-8 py-4 bg-gray-400 text-white rounded-lg font-bold text-lg hover:shadow-lg transition-all"
        >
          💡 提示
        </motion.button>
      </div>

      {/* 提示 */}
      {showHint && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-yellow-50 border-2 border-yellow-300 rounded-lg"
        >
          <p className="text-sm font-semibold text-yellow-800">
            💡 提示: {english}
          </p>
        </motion.div>
      )}
    </motion.div>
  )
}

export default DynamicHanziCard
