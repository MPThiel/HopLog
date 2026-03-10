import { useState, useEffect } from 'react';
import { getBeers, addBeer, updateBeer, deleteBeer } from '../firebase/services';

export const useBeers = () => {
    const [beers, setBeers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchBeers();
    }, []);

    const fetchBeers = async () => {
        try {
            setLoading(true);
            let data = await getBeers();

            // Auto-populate 6 sample beers if completely empty
            if (data.length === 0) {
                const { seedDatabaseIfEmpty } = await import('../firebase/seed');
                data = await seedDatabaseIfEmpty();
            }

            setBeers(data);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const createNewBeer = async (beerData) => {
        try {
            const newBeer = await addBeer(beerData);
            setBeers([newBeer, ...beers]);
            return newBeer;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const editBeer = async (id, beerData) => {
        try {
            const updatedBeer = await updateBeer(id, beerData);
            setBeers(beers.map(b => b.id === id ? { ...b, ...beerData } : b));
            return updatedBeer;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const removeBeer = async (id) => {
        try {
            await deleteBeer(id);
            setBeers(beers.filter(b => b.id !== id));
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    return { beers, loading, error, fetchBeers, createNewBeer, editBeer, removeBeer };
};
