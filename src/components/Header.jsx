import { useNavigate } from 'react-router-dom';
import { Beer } from 'lucide-react';

export default function Header() {
    const navigate = useNavigate();

    return (
        <header className="bg-header text-white px-4 py-4 sticky top-0 z-50 shadow-md">
            <div className="max-w-3xl mx-auto flex items-center justify-between">
                <div
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => navigate('/')}
                >
                    <Beer className="text-primary" size={28} />
                    <h1 className="text-2xl font-heading m-0 text-white leading-none">HopLog</h1>
                </div>
            </div>
        </header>
    );
}
