import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, BookOpen, BarChart3 } from 'lucide-react'

const Sidebar: React.FC = () => {
  const location = useLocation()

  const isActive = (path: string) => {
    return location.pathname === path ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'
  }

  return (
    <aside className="w-64 bg-white shadow-md hidden md:flex flex-col">
      <div className="p-6">
        <h2 className="text-xl font-bold text-primary">菜单</h2>
      </div>
      <nav className="flex-1 px-3 py-6 space-y-2">
        <Link
          to="/"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/')}`}
        >
          <Home size={20} />
          <span>首页</span>
        </Link>
        <Link
          to="/learning"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/learning')}`}
        >
          <BookOpen size={20} />
          <span>学习</span>
        </Link>
        <Link
          to="/dashboard"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/dashboard')}`}
        >
          <BarChart3 size={20} />
          <span>统计</span>
        </Link>
      </nav>
    </aside>
  )
}

export default Sidebar
