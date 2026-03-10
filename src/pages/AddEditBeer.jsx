import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Camera, X } from 'lucide-react';
import { useBeers } from '../hooks/useBeers';
import { getBeerById, uploadBeerImage } from '../firebase/services';

const STYLES = ['IPA', 'Stout', 'Lager', 'Pilsner', 'Porter', 'Ale', 'Sour', 'Wheat', 'Other'];

export default function AddEditBeer() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { createNewBeer, editBeer } = useBeers();
    const fileInputRef = useRef(null);

    const isEditing = Boolean(id);
    const [loading, setLoading] = useState(isEditing);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    // Image state
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

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
                    if (data.imageUrl) {
                        setImagePreview(data.imageUrl);
                    }
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

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setImageFile(file);

        // Generate a local preview immediately
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
    };

    const handleRemoveImage = (e) => {
        e.stopPropagation();
        setImageFile(null);
        setImagePreview(null);
        setFormData(prev => ({ ...prev, imageUrl: '' }));
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.brewery) {
            setError("Name and Brewery are required.");
            return;
        }

        setSubmitting(true);
        setError(null);

        try {
            let finalImageUrl = formData.imageUrl;

            // Upload new image if one was selected
            if (imageFile) {
                finalImageUrl = await uploadBeerImage(imageFile);
            }

            const payload = {
                ...formData,
                imageUrl: finalImageUrl,
                abv: formData.abv ? parseFloat(formData.abv) : null,
                volumeMl: formData.volumeMl ? parseInt(formData.volumeMl, 10) : null
            };

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

                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Photo</label>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            capture="environment"
                            onChange={handleImageChange}
                            className="hidden"
                            id="beer-image-input"
                        />
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="relative w-full h-48 border-2 border-dashed border-gray-200 rounded-2xl overflow-hidden flex items-center justify-center cursor-pointer bg-gray-50 hover:bg-gray-100 hover:border-primary transition-all group"
                        >
                            {imagePreview ? (
                                <>
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-full h-full object-contain p-2"
                                    />
                                    {/* Remove button */}
                                    <button
                                        type="button"
                                        onClick={handleRemoveImage}
                                        className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 transition-colors"
                                    >
                                        <X size={16} />
                                    </button>
                                    {/* Tap-to-change overlay */}
                                    <div className="absolute bottom-0 left-0 right-0 bg-black/30 text-white text-xs text-center py-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                        Tap to change photo
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-col items-center gap-2 text-gray-400 group-hover:text-primary transition-colors pointer-events-none">
                                    <Camera size={36} strokeWidth={1.5} />
                                    <span className="text-sm font-medium">Add Photo</span>
                                    <span className="text-xs text-gray-400">Tap to choose from library or capture</span>
                                </div>
                            )}
                        </div>
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
                            {submitting ? (imageFile ? 'Uploading photo...' : 'Saving...') : (isEditing ? 'Save Changes' : 'Add Drink')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
