import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star } from 'lucide-react';
import { useBeers } from '../hooks/useBeers';
import { getBeerById } from '../firebase/services';

const STYLES = ['IPA', 'Stout', 'Lager', 'Pilsner', 'Porter', 'Ale', 'Sour', 'Wheat', 'Other'];

export default function AddEditBeer() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { createNewBeer, editBeer } = useBeers();

    const isEditing = Boolean(id);
    const [loading, setLoading] = useState(isEditing);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        brewery: '',
        country: '',
        style: 'Pilsner',
        abv: '',
        volumeMl: '',
        imageUrl: '',
        rating: 0,
        tastingNotes: ''
    });

    useEffect(() => {
        if (isEditing) {
            getBeerById(id)
                .then(data => {
                    setFormData({
                        ...data,
                        abv: data.abv || '',
                        volumeMl: data.volumeMl || ''
                    });
                    setLoading(false);
                })
                .catch(err => {
                    setError(err.message);
                    setLoading(false);
                });
        }
    }, [id, isEditing]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleRating = (ratingValue) => {
        setFormData(prev => ({ ...prev, rating: ratingValue }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.brewery) {
            setError("Name and Brewery are required.");
            return;
        }

        setSubmitting(true);
        setError(null);

        const payload = {
            ...formData,
            abv: formData.abv ? parseFloat(formData.abv) : null,
            volumeMl: formData.volumeMl ? parseInt(formData.volumeMl, 10) : null
        };

        try {
            if (isEditing) {
                await editBeer(id, payload);
            } else {
                await createNewBeer(payload);
            }
            navigate(-1);
        } catch (err) {
            setError(err.message || 'Failed to save beer.');
            setSubmitting(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading form...</div>;

    return (
        <div className="bg-white rounded-[32px] overflow-hidden shadow-sm relative pb-8">
            <div className="bg-header px-6 py-6 flex items-center justify-between rounded-b-[32px] mb-8 shadow-md">
                <button onClick={() => navigate(-1)} className="text-white hover:text-primary transition-colors">
                    <ArrowLeft size={28} />
                </button>
                <h1 className="text-2xl font-heading text-white">{isEditing ? 'Edit Drink' : 'Add Drink'}</h1>
                <div className="w-7" /> {/* Spacer for centering */}
            </div>

            <div className="px-6 sm:px-10">
                {error && <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Drink Name *</label>
                        <input
                            type="text" name="name" required
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-gray-50 hover:bg-white transition-colors"
                            value={formData.name} onChange={handleChange} placeholder="e.g. 1936 Biere"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Brewery *</label>
                        <input
                            type="text" name="brewery" required
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-gray-50 hover:bg-white transition-colors"
                            value={formData.brewery} onChange={handleChange} placeholder="e.g. Brauerei Locher"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Country</label>
                            <input
                                type="text" name="country"
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-gray-50 hover:bg-white transition-colors"
                                value={formData.country} onChange={handleChange} placeholder="e.g. Switzerland"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Style</label>
                            <select
                                name="style"
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-gray-50 hover:bg-white transition-colors cursor-pointer"
                                value={formData.style} onChange={handleChange}
                            >
                                {STYLES.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">ABV (%)</label>
                            <input
                                type="number" step="0.1" name="abv"
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-gray-50 hover:bg-white transition-colors"
                                value={formData.abv} onChange={handleChange} placeholder="e.g. 4.7"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Volume (ml)</label>
                            <input
                                type="number" name="volumeMl"
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-gray-50 hover:bg-white transition-colors"
                                value={formData.volumeMl} onChange={handleChange} placeholder="e.g. 330"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Image URL</label>
                        <input
                            type="url" name="imageUrl"
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-gray-50 hover:bg-white transition-colors"
                            value={formData.imageUrl} onChange={handleChange} placeholder="https://example.com/bottle.png"
                        />
                    </div>

                    <div className="pt-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-3">Rating</label>
                        <div className="flex gap-1 sm:gap-2 bg-gray-50 p-4 rounded-xl items-center border border-gray-100">
                            {[1, 2, 3, 4, 5].map(star => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => handleRating(star)}
                                    className="p-1 sm:p-2 transition-transform hover:scale-110 focus:outline-none"
                                >
                                    <Star
                                        size={36}
                                        className={star <= formData.rating ? "fill-primary text-primary drop-shadow-sm" : "text-gray-200 fill-gray-200"}
                                    />
                                </button>
                            ))}
                            <span className="ml-auto text-3xl font-heading font-bold text-header">
                                {formData.rating ? formData.rating.toFixed(1) : '0.0'}
                            </span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Tasting Notes</label>
                        <textarea
                            name="tastingNotes" rows="5"
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-gray-50 hover:bg-white transition-colors resize-y leading-relaxed"
                            value={formData.tastingNotes} onChange={handleChange} placeholder="Describe the flavor, aroma, mouthfeel..."
                        ></textarea>
                    </div>

                    <div className="pt-6">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full bg-primary hover:bg-primary/90 text-white font-bold text-lg py-4 rounded-2xl shadow-lg transition-all disabled:opacity-50 hover:-translate-y-1"
                        >
                            {submitting ? 'Saving...' : (isEditing ? 'Save Changes' : 'Add Drink')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
