import { ActiveYearWarningBanner } from '../common/ActiveYearWarningBanner'
import { Header } from './Header'
import { Navbar } from './Navbar'

export const MainLayout = ({ currentView, onViewChange, children }) => {
    return (
        <div className="min-h-screen flex flex-col bg-main text-content font-sans">
            <Header />
            <Navbar currentView={currentView} onViewChange={onViewChange} />
            <ActiveYearWarningBanner onViewChange={onViewChange} />

            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20 sm:pb-8">
                {children}
            </main>
        </div>
    )
}