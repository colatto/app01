
import React, { useEffect } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { 
  Building2, 
  Users, 
  Package, 
  FileText, 
  Calendar, 
  ShoppingCart, 
  Clipboard, 
  DollarSign, 
  Settings,
  LogOut,
  User
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function Layout() {
  const { usuario, logout, hasAccess } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Verificar se usuário está autenticado - LOGIN OBRIGATÓRIO
  useEffect(() => {
    if (!usuario) {
      navigate('/login')
    }
  }, [usuario, navigate])

  // Se não há usuário logado, não renderizar o layout
  if (!usuario) {
    return null
  }

  const menuItems = [
    { 
      path: '/dashboard', 
      label: 'Dashboard', 
      icon: Building2,
      module: 'dashboard'
    },
    { 
      path: '/crm', 
      label: 'CRM', 
      icon: Users,
      module: 'crm'
    },
    { 
      path: '/insumos', 
      label: 'Base de Insumos', 
      icon: Package,
      module: 'insumos'
    },
    { 
      path: '/proposta', 
      label: 'Proposta', 
      icon: FileText,
      module: 'orcamento'
    },
    { 
      path: '/contratos-v2', 
      label: 'Contratos', 
      icon: FileText,
      module: 'contrato'
    },
    { 
      path: '/funcionarios', 
      label: 'Funcionários', 
      icon: Users,
      module: 'funcionarios'
    },
    { 
      path: '/planejamento', 
      label: 'Planejamento de Obra', 
      icon: Calendar,
      module: 'planejamento'
    },
    { 
      path: '/planejamento-semanal', 
      label: 'Planejamento Semanal', 
      icon: Calendar,
      module: 'planejamento'
    },
    { 
      path: '/compras', 
      label: 'Compras/Estoque', 
      icon: ShoppingCart,
      module: 'compras'
    },
    { 
      path: '/diario', 
      label: 'Diário de Obra', 
      icon: Clipboard,
      module: 'planejamento'
    },
    { 
      path: '/financeiro', 
      label: 'Financeiro', 
      icon: DollarSign,
      module: 'financeiro'
    },
    { 
      path: '/usuarios', 
      label: 'Usuários', 
      icon: Settings,
      module: 'usuarios'
    }
  ]

  const filteredMenuItems = menuItems.filter(item => hasAccess(item.module))

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4">
          <div className="flex items-center space-x-2">
            <Building2 className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">Gestão /R3</span>
          </div>
        </div>
        
        <nav className="mt-4">
          {filteredMenuItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center px-4 py-3 text-left hover:bg-gray-50 ${
                  isActive ? 'bg-blue-50 border-r-2 border-blue-500 text-blue-700' : 'text-gray-700'
                }`}
              >
                <Icon className="h-5 w-5 mr-3" />
                {item.label}
              </button>
            )
          })}
        </nav>

        {/* User Info */}
        <div className="absolute bottom-0 w-64 p-4 border-t bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-700">{usuario.nome}</p>
                <p className="text-xs text-gray-500">{usuario.nivelAcesso}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="text-gray-500 hover:text-red-600"
              title="Sair"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
