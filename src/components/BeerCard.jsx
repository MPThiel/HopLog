import { Star, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function BeerCard({ beer }) {
    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate(`/beer/${beer.id}`)}
            className="bg-white rounded-[24px] p-4 shadow-sm flex items-center gap-4 cursor-pointer hover:shadow-md transition-shadow mb-4"
        >
            <div className="w-16 h-28 shrink-0 bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center p-2 mb-[-8px] mt-[-8px]">
                {beer.imageUrl ? (
                    <img
                        src={beer.imageUrl}
                        alt={beer.name}
                        className="w-full h-full object-contain drop-shadow-md"
                        onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                        }}
                    />
                ) : null}
                <div
                    className="text-gray-400 text-xs text-center p-1 items-center justify-center"
                    style={{ display: beer.imageUrl ? 'none' : 'flex' }}
                >
                    🍺
                </div>
            </div>

            <div className="flex-1 min-w-0 py-1">
                <h3 className="font-heading font-bold text-lg text-header truncate">{beer.name}</h3>
                <p className="text-sm text-gray-500 truncate">{beer.brewery}</p>
                <p className="text-xs text-gray-400 truncate">{beer.country && <span>{beer.country}</span>}</p>

                <div className="flex items-center gap-[2px] mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                            key={star}
                            size={14}
                            className={star <= (beer.rating || 0) ? "fill-header text-header" : "text-gray-200 fill-gray-200"}
                        />
                    ))}
                    <span className="text-xs font-semibold ml-2 text-header">{beer.rating ? beer.rating.toFixed(1) : '0.0'}</span>
                </div>
            </div>

            <div className="shrink-0 flex items-center justify-center w-10 h-10 rounded-full border border-primary text-primary hover:bg-primary/10 transition-colors"
                onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/edit/${beer.id}`);
                }}>
                <Plus size={20} />
            </div>
        </div>
    );
}
