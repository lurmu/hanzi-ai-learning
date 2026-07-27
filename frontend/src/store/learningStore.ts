import { create } from 'zustand'

interface LearningStore {
  currentHanziIndex: number
  correctCount: number
  totalCount: number
  setCurrentHanziIndex: (index: number) => void
  incrementCorrectCount: () => void
  incrementTotalCount: () => void
  reset: () => void
}

export const useLearningStore = create<LearningStore>((set) => ({
  currentHanziIndex: 0,
  correctCount: 0,
  totalCount: 0,
  setCurrentHanziIndex: (index: number) => set({ currentHanziIndex: index }),
  incrementCorrectCount: () => set((state) => ({ correctCount: state.correctCount + 1 })),
  incrementTotalCount: () => set((state) => ({ totalCount: state.totalCount + 1 })),
  reset: () => set({ currentHanziIndex: 0, correctCount: 0, totalCount: 0 }),
}))
