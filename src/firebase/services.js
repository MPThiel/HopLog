import { db } from './config';
import { collection, getDocs, getDoc, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, query, orderBy } from "firebase/firestore";

const beersCollection = collection(db, 'beers');

export const getBeers = async () => {
    const q = query(beersCollection, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getBeerById = async (id) => {
    const beerDoc = await getDoc(doc(db, 'beers', id));
    if (beerDoc.exists()) {
        return { id: beerDoc.id, ...beerDoc.data() };
    }
    throw new Error("Beer not found");
};

export const addBeer = async (beerData) => {
    const newBeerData = {
        ...beerData,
        createdAt: serverTimestamp()
    };
    const docRef = await addDoc(beersCollection, newBeerData);
    return { id: docRef.id, ...newBeerData };
};

export const updateBeer = async (id, beerData) => {
    const beerRef = doc(db, 'beers', id);
    await updateDoc(beerRef, beerData);
    return { id, ...beerData };
};

export const deleteBeer = async (id) => {
    const beerRef = doc(db, 'beers', id);
    await deleteDoc(beerRef);
    return id;
};
