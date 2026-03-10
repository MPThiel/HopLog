import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, SlidersHorizontal } from 'lucide-react';
import { useBeers } from '../hooks/useBeers';
import BeerCard from '../components/BeerCard';

export default function Home() {
    const { beers, loading, error } = useBeers();
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("date"); // date, rating, style

    const filteredAndSortedBeers = useMemo(() => {
        let result = [...beers];

        // Filter
        if (search) {
            const q = search.toLowerCase();
            result = result.filter(b =>
                b.name?.toLowerCase().includes(q) ||
                b.brewery?.toLowerCase().includes(q)
            );
        }

        // Sort
        if (sortBy === 'rating') {
            result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        } else if (sortBy === 'style') {
            result.sort((a, b) => (a.style || '').localeCompare(b.style || ''));
        }

        return result;
    }, [beers, search, sortBy]);

    // Group by style
    const groupedBeers = useMemo(() => {
        const groups = {};
        filteredAndSortedBeers.forEach(beer => {
            const style = beer.style || 'Other';
            if (!groups[style]) groups[style] = [];
            groups[style].push(beer);
        });
        return Object.keys(groups).sort().reduce((acc, key) => {
            acc[key] = groups[key];
            return acc;
        }, {});
    }, [filteredAndSortedBeers]);

    if (loading) return <div className="p-8 text-center text-gray-500">Loading beers...</div>;
    if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;

    return (
        <div className="relative pb-24">
            {/* Search and Sort */}
            <div className="mb-6 flex gap-3 items-center px-1">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by name or brewery..."
                        className="w-full bg-white rounded-full py-4 pl-12 pr-4 outline-none shadow-sm focus:ring-2 focus:ring-primary/50 transition-shadow"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <button
                    onClick={() => {
                        const next = sortBy === 'date' ? 'rating' : sortBy === 'rating' ? 'style' : 'date';
                        setSortBy(next);
                    }}
                    className="bg-header p-4 rounded-full text-white shrink-0 shadow-sm"
                    title={`Sort by: ${sortBy}`}
                >
                    <SlidersHorizontal size={20} />
                </button>
            </div>

            <div className="text-sm text-gray-500 mb-6 px-3 flex justify-between items-center">
                <span>We found <strong>{filteredAndSortedBeers.length}</strong> beers</span>
                <span>Sorted by: <span className="font-semibold text-header capitalize">{sortBy}</span></span>
            </div>

            <div className="bg-white rounded-[32px] p-4 sm:p-6 shadow-sm min-h-[50vh]">
                {Object.entries(groupedBeers).length === 0 ? (
                    <div className="text-center p-8 text-gray-500">No beers match your criteria.</div>
                ) : (
                    Object.entries(groupedBeers).map(([style, styleBeers]) => (
                        <div key={style} className="mb-8 last:mb-0">
                            <h2 className="text-2xl font-heading font-bold text-header mb-4 px-2 tracking-tight">{style}</h2>
                            <div>
                                {styleBeers.map(beer => (
                                    <BeerCard key={beer.id} beer={beer} />
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* FAB */}
            <button
                onClick={() => navigate('/add')}
                className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 w-16 h-16 bg-primary text-white rounded-full shadow-lg flex items-center justify-center hover:bg-primary/90 transition-transform hover:scale-105 active:scale-95 z-40"
            >
                <Plus size={32} />
            </button>
        </div>
    );
}
