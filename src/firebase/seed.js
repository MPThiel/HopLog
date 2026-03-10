import { addBeer, getBeers } from './services';

const sampleBeers = [
    {
        name: "1936 Biere",
        brewery: "Brauerei Locher",
        country: "Switzerland",
        style: "Lager",
        abv: 4.7,
        volumeMl: 330,
        imageUrl: "https://images.unsplash.com/photo-1614316146059-d8be30cdbbed?auto=format&fit=crop&q=80&w=200",
        rating: 4.5,
        tastingNotes: "The beer is smooth, dark and sweet. Notes of vanilla, cocoa nibs play wonderfully on the palate."
    },
    {
        name: "Stone Free",
        brewery: "8 Wired",
        country: "New Zealand",
        style: "IPA",
        abv: 6.0,
        volumeMl: 500,
        imageUrl: "https://images.unsplash.com/photo-1600860473925-021c33f2ac33?auto=format&fit=crop&q=80&w=200",
        rating: 4.2,
        tastingNotes: "A fruity, slightly hazy pale ale with vibrant tropical hops."
    },
    {
        name: "Baltic Porter",
        brewery: "8 Sail",
        country: "UK",
        style: "Porter",
        abv: 7.5,
        volumeMl: 500,
        imageUrl: "https://images.unsplash.com/photo-1571513722275-4b41940f54b8?auto=format&fit=crop&q=80&w=200",
        rating: 4.0,
        tastingNotes: "Rich, dark, and warming. Hints of dark chocolate and roasted malt."
    },
    {
        name: "Abbaye de Saint Martin Blonde",
        brewery: "Brasserie Brunehaut",
        country: "Belgium",
        style: "Ale",
        abv: 7.0,
        volumeMl: 330,
        imageUrl: "https://plus.unsplash.com/premium_photo-1668473366050-b8c3453a258a?auto=format&fit=crop&q=80&w=200",
        rating: 4.8,
        tastingNotes: "Classic Belgian blonde. Spicy yeast notes and a crisp, dry finish."
    },
    {
        name: "Innkeeper",
        brewery: "8 Sail",
        country: "UK",
        style: "Ale",
        abv: 4.5,
        volumeMl: 500,
        imageUrl: "https://images.unsplash.com/photo-1563514995536-da9dc98e69ac?auto=format&fit=crop&q=80&w=200",
        rating: 3.5,
        tastingNotes: "Traditional English Bitter. Malty backdrop with a pleasant earthy hop character."
    },
    {
        name: "Damson Porter",
        brewery: "8 Sail",
        country: "UK",
        style: "Porter",
        abv: 5.0,
        volumeMl: 500,
        imageUrl: "https://images.unsplash.com/photo-1566371512411-cfac208f0ba6?auto=format&fit=crop&q=80&w=200",
        rating: 4.6,
        tastingNotes: "A smooth porter brewed with real damsons for a tart, fruity edge."
    }
];

export const seedDatabaseIfEmpty = async () => {
    try {
        const existing = await getBeers();
        if (existing.length === 0) {
            console.log("Database is empty. Seeding with sample data...");
            for (const beer of sampleBeers) {
                await addBeer(beer);
            }
            return await getBeers();
        }
        return existing;
    } catch (error) {
        console.error("Error seeding database:", error);
        return [];
    }
}
