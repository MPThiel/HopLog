import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Star, Droplets, Globe, Tag } from 'lucide-react';
import { useBeer } from '../hooks/useBeer';
import { useBeers } from '../hooks/useBeers';

export default function BeerDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { beer, loading, error } = useBeer(id);
    const { removeBeer } = useBeers();

    if (loading) return <div className="p-8 text-center text-gray-500">Loading details...</div>;
    if (error || !beer) return <div className="p-8 text-center text-red-500">Error: {error || 'Beer not found'}</div>;

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this drink?")) {
            await removeBeer(id);
            navigate('/');
        }
    };

    return (
        <div className="bg-white rounded-[32px] overflow-hidden shadow-sm relative pb-8 min-h-[80vh]">
            {/* Top Image Section */}
            <div className="bg-header relative pt-6 pb-12 flex justify-center items-center rounded-b-[40px]">
                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-6 left-6 text-white hover:text-primary transition-colors"
                >
                    <ArrowLeft size={28} />
                </button>
                <div className="absolute top-6 right-6 flex gap-4">
                    <button onClick={() => navigate(`/edit/${id}`)} className="text-white hover:text-primary transition-colors">
                        <Edit size={24} />
                    </button>
                    <button onClick={handleDelete} className="text-white hover:text-red-400 transition-colors">
                        <Trash2 size={24} />
                    </button>
                </div>

                <div className="w-48 h-72 mt-8 flex items-center justify-center relative">
                    {beer.imageUrl ? (
                        <img src={beer.imageUrl} alt={beer.name} className="max-w-full max-h-full object-contain drop-shadow-2xl z-10" />
                    ) : (
                        <div className="flex items-center justify-center w-32 h-48 bg-white/10 rounded-xl text-white/50 z-10">
                            No Image
                        </div>
                    )}
                </div>
            </div>

            {/* Content Section */}
            <div className="px-6 sm:px-10 -mt-8 relative z-20">
                <div className="bg-white rounded-2xl p-4 shadow-lg inline-flex flex-wrap gap-2 mb-6 border border-gray-50 max-w-full">
                    <div className="bg-bg-warm px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                        <Tag size={16} className="text-primary" /> {beer.style || 'Unspecified'}
                    </div>
                    <div className="bg-bg-warm px-4 py-2 rounded-full text-sm font-semibold">
                        Alc. {beer.abv ? `${beer.abv}%` : 'N/A'}
                    </div>
                    <div className="bg-bg-warm px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                        <Droplets size={16} className="text-primary" /> {beer.volumeMl ? `${beer.volumeMl}ml` : 'N/A'}
                    </div>
                    {beer.country && (
                        <div className="bg-bg-warm px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                            <Globe size={16} className="text-primary" /> {beer.country}
                        </div>
                    )}
                </div>

                <h1 className="text-3xl sm:text-4xl font-heading font-bold text-header mb-1 tracking-tight">{beer.name}</h1>
                <p className="text-lg text-gray-500 mb-6">{beer.brewery}</p>

                <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-100">
                    <div className="flex items-center gap-[2px]">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                                key={star}
                                size={24}
                                className={star <= (beer.rating || 0) ? "fill-primary text-primary" : "text-gray-200 fill-gray-200"}
                            />
                        ))}
                        <span className="text-xl font-bold ml-3 text-header">{beer.rating ? beer.rating.toFixed(1) : '0.0'}</span>
                    </div>
                    {beer.createdAt && (
                        <div className="text-sm text-gray-400">
                            Added {new Date(beer.createdAt?.seconds * 1000).toLocaleDateString()}
                        </div>
                    )}
                </div>

                <div>
                    <h3 className="text-xl font-heading font-bold text-header mb-3">Tasting Notes</h3>
                    <p className="text-gray-600 leading-relaxed whitespace-pre-wrap text-lg">
                        {beer.tastingNotes || 'No tasting notes provided.'}
                    </p>
                </div>
            </div>
        </div>
    );
}
