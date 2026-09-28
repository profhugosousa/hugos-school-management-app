import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MainLayout } from './components/layout/MainLayout'
import { AuthProvider } from './context/AuthContext'
import { SidebarProvider } from './context/SidebarContext'
import { ThemeProvider } from './context/ThemeContext'
import { AcademicYearsPage } from './features/academic-years/AcademicYearsPage'
import { LoginPage } from './features/auth/LoginPage'
import { useAuth } from './hooks/useAuth'

const AppContent = () => {
  const { user, loading } = useAuth()
  const [currentView, setCurrentView] = useState('academic-years')
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

  const renderView = () => {
    switch (currentView) {
      case 'academic-years':
        return <AcademicYearsPage />
      default:
        return (
          <div className="p-6 border border-line bg-main font-mono text-xs text-muted uppercase">
            {currentView} {t('common.viewNotImplemented')}
          </div>
        )
    }
  }

  return (
    <MainLayout currentView={currentView} onViewChange={setCurrentView}>
      {renderView()}
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