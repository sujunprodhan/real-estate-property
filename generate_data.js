const fs = require('fs');

const categories = ["Villa", "Apartment", "Family House", "Commercial", "Land Plot"];
const amenitiesList = [
    ["Swimming Pool", "Smart Home", "Garage", "Ocean View", "Gym", "Security System"],
    ["Balcony", "Elevator", "Doorman", "Fitness Center", "City View"],
    ["Backyard", "Fireplace", "Central AC", "Garage", "Pet Friendly"],
    ["Conference Rooms", "Security", "Parking Garage", "High-Speed Internet", "Cafeteria"],
    ["Water Connection", "Electricity", "Main Road Access", "Fenced"]
];

const agents = [
    { name: "Sarah Jenkins", email: "sarah.j@realestate.com", phone: "+1 (555) 123-4567", image: "https://i.ibb.co/Qd5h03v/agent-1.jpg" },
    { name: "Michael Chen", email: "m.chen@realestate.com", phone: "+1 (555) 987-6543", image: "https://i.ibb.co/R2t9Wb4/agent-2.jpg" },
    { name: "Emma Watson", email: "emma.w@realestate.com", phone: "+1 (555) 456-7890", image: "https://i.ibb.co/6P8Xq1m/agent-3.jpg" },
    { name: "David Martinez", email: "david.m@realestate.com", phone: "+1 (555) 789-0123", image: "https://i.ibb.co/S6P4b9Z/agent-4.jpg" }
];

const properties = [];

const imagesMap = {
    "Villa": ["https://i.ibb.co/cT4zK7Z/luxury-villa-1.jpg", "https://i.ibb.co/yQn7wDq/luxury-villa-2.jpg"],
    "Apartment": ["https://i.ibb.co/k2D5m2s/penthouse-1.jpg", "https://i.ibb.co/J3v7X7q/penthouse-2.jpg"],
    "Family House": ["https://i.ibb.co/M9X2ZpG/suburban-house-1.jpg", "https://i.ibb.co/v4d7bC2/suburban-house-2.jpg"],
    "Commercial": ["https://i.ibb.co/B3T5c7V/commercial-1.jpg", "https://i.ibb.co/Wf9Z2N6/commercial-2.jpg"],
    "Land Plot": ["https://i.ibb.co/4T7V2kP/cabin-1.jpg", "https://i.ibb.co/8Y2Q7xM/cabin-2.jpg"]
};

categories.forEach((category, index) => {
    for (let i = 1; i <= 5; i++) {
        const agent = agents[Math.floor(Math.random() * agents.length)];
        const prop = {
            title: `${category} ${i} - Premium Real Estate`,
            description: `Beautiful ${category.toLowerCase()} located in a prime area. Excellent for investment or personal use. Comes with top-tier amenities and a great neighborhood.`,
            propertyType: category === "Family House" ? "House" : category,
            category: category,
            status: i % 2 === 0 ? "For Rent" : "For Sale",
            price: Math.floor(Math.random() * 500000) + (index === 0 ? 1000000 : 50000),
            area: Math.floor(Math.random() * 2000) + 1000,
            bedrooms: category === "Land Plot" || category === "Commercial" ? 0 : Math.floor(Math.random() * 4) + 2,
            bathrooms: category === "Land Plot" ? 0 : Math.floor(Math.random() * 3) + 1,
            location: {
                address: `${Math.floor(Math.random() * 900) + 100} ${['Ocean', 'Maple', 'Pine', 'Oak', 'Cedar'][Math.floor(Math.random()*5)]} Street`,
                city: ["Miami", "New York", "Austin", "San Francisco", "Chicago", "Denver"][Math.floor(Math.random() * 6)],
                state: "US",
                country: "USA",
                zipCode: `${Math.floor(Math.random() * 80000) + 10000}`,
                coordinates: {
                    lat: parseFloat(((Math.random() * 15) + 30).toFixed(4)),
                    lng: parseFloat(((Math.random() * 40) - 120).toFixed(4))
                }
            },
            amenities: amenitiesList[index],
            images: imagesMap[category],
            agent: agent,
            booking: {
                isAvailable: true,
                bookingStatus: "Available",
                bookingFee: Math.floor(Math.random() * 100) + 20,
                bookedDates: []
            },
            reviews: [],
            soldCount: 0,
            yearBuilt: Math.floor(Math.random() * 20) + 2000,
            featured: i === 1,
            createdAt: {
                "$date": new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString()
            }
        };
        properties.push(prop);
    }
});

fs.writeFileSync('properties.json', JSON.stringify(properties, null, 2));
console.log('Successfully generated properties.json with 25 properties');
