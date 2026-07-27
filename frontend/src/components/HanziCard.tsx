import React from 'react'
import { motion } from 'framer-motion'

interface HanziCardProps {
  character: string
  pinyin: string
  english: string
  difficulty: number
  onCorrect: () => void
  onIncorrect: () => void
}

const HanziCard: React.FC<HanziCardProps> = ({
  character,
  pinyin,
  english,
  difficulty,
  onCorrect,
  onIncorrect,
}) => {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="bg-white rounded-lg shadow-lg p-8 text-center"
    >
      <div className="mb-6">
        <div className="text-7xl font-bold text-primary mb-4">{character}</div>
        <p className="text-2xl text-gray-600 mb-2">{pinyin}</p>
        <p className="text-xl text-gray-500 mb-4">{english}</p>
        <div className="flex justify-center gap-1">
          {Array.from({ length: difficulty }).map((_, i) => (
            <div key={i} className="w-3 h-3 rounded-full bg-warning"></div>
          ))}
        </div>
      </div>
      <div className="flex gap-4 justify-center">
        <button
          onClick={onCorrect}
          className="px-8 py-3 bg-success text-white rounded-lg hover:opacity-90 transition-opacity font-bold"
        >
          ✓ 认识
        </button>
        <button
          onClick={onIncorrect}
          className="px-8 py-3 bg-danger text-white rounded-lg hover:opacity-90 transition-opacity font-bold"
        >
          ✗ 不认识
        </button>
      </div>
    </motion.div>
  )
}

export default HanziCard
