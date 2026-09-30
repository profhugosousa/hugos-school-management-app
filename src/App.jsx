import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MainLayout } from './components/layout/MainLayout'
import { AcademicYearProvider } from './context/AcademicYearProvider'
import { AuthProvider } from './context/AuthContext'
import { NotificationProvider } from './context/NotificationProvider'
import { SidebarProvider } from './context/SidebarContext'
import { ThemeProvider } from './context/ThemeContext'
import { AcademicYearsPage } from './features/academic-years/AcademicYearsPage'
import { LoginPage } from './features/auth/LoginPage'
import { GroupsPage } from './features/groups/GroupsPage'
import { LessonsPage } from './features/lessons/LessonsPage'
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
      case 'lessons':
        return <LessonsPage />
      case 'groups':
        return <GroupsPage />
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
          <NotificationProvider>
            <AcademicYearProvider>
              <AppContent />
            </AcademicYearProvider>
          </NotificationProvider>
        </SidebarProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}