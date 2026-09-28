import { Header } from './Header'
import { Sidebar } from './Sidebar'

export const MainLayout = ({ currentView, onViewChange, children }) => {
    return (
        <div className="min-h-screen flex flex-col bg-main text-content font-sans">
            <Header />
            <div className="flex flex-1">
                <Sidebar currentView={currentView} onViewChange={onViewChange} />
                <main className="flex-1 p-6 sm:p-8">
                    {children}
                </main>
            </div>
        </div>
    )
}