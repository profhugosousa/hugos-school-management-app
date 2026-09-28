import { useTranslation } from 'react-i18next'
import { MainLayout } from './components/layout/MainLayout'
import { AuthProvider } from './context/AuthContext.jsx'
import { SidebarProvider } from './context/SidebarContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { LoginPage } from './features/auth/LoginPage'
import { useAuth } from './hooks/useAuth'

const AppContent = () => {
  const { user, loading } = useAuth()
  const { t } = useTranslation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-main text-content font-mono text-xs tracking-widest">
        {t('common.initializing')}
      </div>
    )
  }

  if (!user) {
    return <LoginPage />
  }

  return (
    <MainLayout>
      <div className="border border-line p-4 sm:p-6 bg-main">
        <h2 className="text-lg sm:text-xl font-bold uppercase tracking-tight text-content">
          {t('dashboard.title')}
        </h2>
        <p className="text-xs text-muted font-mono mt-1">
          {t('dashboard.subtitle')}
        </p>
      </div>
    </MainLayout>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SidebarProvider>
          <AppContent />
        </SidebarProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}