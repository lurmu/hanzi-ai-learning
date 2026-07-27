import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { LogOut, Settings } from 'lucide-react'

const Header: React.FC = () => {
  const navigate = useNavigate()
  const { logout } = useAuthStore()
  const [eyeFriendlyMode, setEyeFriendlyMode] = React.useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const toggleEyeFriendlyMode = () => {
    setEyeFriendlyMode(!eyeFriendlyMode)
    if (eyeFriendlyMode) {
      document.body.classList.remove('eye-friendly')
    } else {
      document.body.classList.add('eye-friendly')
    }
  }

  return (
    <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-primary">汉字AI学习系统</h1>
      <div className="flex items-center gap-4">
        <button
          onClick={toggleEyeFriendlyMode}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="护眼模式"
        >
          <Settings size={20} />
        </button>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut size={20} />
          退出
        </button>
      </div>
    </header>
  )
}

export default Header
