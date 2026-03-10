import { Outlet } from 'react-router-dom';
import Header from './Header';

export default function Layout() {
    return (
        <div className="min-h-screen flex flex-col bg-bg-warm">
            <Header />
            <main className="flex-1 max-w-3xl w-full mx-auto p-4 md:py-8">
                <Outlet />
            </main>
        </div>
    );
}
