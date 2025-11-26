let selectedInterests = JSON.parse(localStorage.getItem("selectedInterests")) || [];
let selectedBudget = Number(localStorage.getItem("selectedBudget")) || 0;
let selectedDuration = JSON.parse(localStorage.getItem("selectedDuration")) || [];
let selectedStyle = JSON.parse(localStorage.getItem("selectedStyle")) || [];

const cardContainer = document.getElementById("trip-cards");

console.log("User selected interests:", selectedInterests);
console.log("User budget:", selectedBudget);
console.log("User duration:", selectedDuration);
console.log("User Style:", selectedStyle);

const knowledgeBase = [
    // BEACH Done
    {
        id: "pagudpud_saud_beach",
        interest: "beach",
        duration: null,
        style: null,
        min: 0,
        max: 3000
    },
    {
        id: "blue_lagoon_pagudpud",
        interest: "beach",
        duration: "dayTrip",
        style: "scenic",
        min: 0,
        max: 5000
    },
    {
        id: "kapurpurawan_rock_formations",
        interest: "beach",
        duration: "dayTrip",
        style: "scenic",
        min: 0,
        max: 5000
    },
    {
        id: "currimao_beach",
        interest: "beach",
        duration: "dayTrip",
        style: "scenic",
        min: 0,
        max: 3000
    },

    // FALLS Done
    {
        id: "kabigan_falls",
        interest: "falls",
        duration: "dayTrip",
        style: "scenic",
        min: 0,
        max: 5000
    },
    {
        id: "tanap_avis_falls",
        interest: "falls",
        duration: "dayTrip",
        style: "scenic",
        min: 0,
        max: 5000
    },
    {
        id: "encantadora_falls",
        interest: "falls",
        duration: "dayTrip",
        style: "scenic",
        min: 0,
        max: 1000
    },
    {
        id: "kingkong_falls",
        interest: "falls",
        duration: "dayTrip",
        style: "scenic",
        min: 0,
        max: 2000
    },

    // CHURCH Done
    {
        id: "paoay_church",
        interest: "church",
        duration: "dayTrip",
        style: "scenic",
        min: 0,
        max: 5000
    },
    {
        id: "st_william_church",
        interest: "church",
        duration: "dayTrip",
        style: "scenic",
        min: 0,
        max: 5000
    },
    {
        id: "santa_monica_church",
        interest: "church",
        duration: "dayTrip",
        style: "scenic",
        min: 0,
        max: 1000
    },
    {
        id: "san_nicolas_church",
        interest: "church",
        duration: "dayTrip",
        style: "scenic",
        min: 0,
        max: 2000
    },

    // LANDMARKS Done
    {
        id: "bangui_windmills_park",
        interest: "landmark",
        duration: "dayTrip",
        style: "scenic",
        min: 0,
        max: 5000
    },
    {
        id: "patapat_viaduct",
        interest: "landmark",
        duration: "dayTrip",
        style: "scenic",
        min: 0,
        max: 5000
    },
    {
        id: "malacanang_of_the_north",
        interest: "landmark",
        duration: "dayTrip",
        style: "scenic",
        min: 0,
        max: 3000
    },
    {
        id: "sand_dunes",
        interest: "landmark",
        duration: "dayTrip",
        style: "scenic",
        min: 0,
        max: 4000
    },

    // Mountains Done
    {
        id: "mount_sicapoo",
        interest: "mountains",
        duration: "dayTrip",
        style: "scenic",
        min: 0,
        max: 3000
    },
    {
        id: "mount_lammin",
        interest: "mountains",
        duration: "dayTrip",
        style: "scenic",
        min: 0,
        max: 2000 
    },

    // Cafe Done
    {
        id: "cuisine_de_iloco",
        interest: "cafe",
        duration: "dayTrip",
        style: "scenic",
        min: 0,
        max: 2000
    },
    {
        id: "cafe_teria",
        interest: "cafe",
        duration: "dayTrip",
        style: "scenic",
        min: 0,
        max: 2000
    },
    {
        id: "cafe_ilocandia",
        interest: "cafe",
        duration: "dayTrip",
        style: "scenic",
        min: 0,
        max: 2000
    },
    {
        id: "art_cafe_pagudpud",
        interest: "cafe",
        duration: "dayTrip",
        style: "scenic",
        min: 0,
        max: 2000
    },

    // Hotels Done
    {
        id: "java_hotel",
        interest: "hotel",
        duration: "dayTrip",
        style: "scenic",
        min: 0,
        max: 2000
    },
    {
        id: "plaza_del_norte",
        interest: "hotel",
        duration: "dayTrip",
        style: "scenic",
        min: 0,
        max: 2000
    },
    {
        id: "fort_ilocandia",
        interest: "hotel",
        duration: "dayTrip",
        style: "scenic",
        min: 0,
        max: 2000
    },
    {
        id: "balay_travel_lodge",
        interest: "hotel",
        duration: "2days",
        style: "romantic",
        min: 0,
        max: 2000
    },
];

function runExpertSystem(interests, budget, duration, style) {
    let results = [];

    knowledgeBase.forEach(place => {
        console.log(`Checking ${place.id}: interest=${place.interest}, budget range=${place.min}-${place.max}, trip duration=${place.duration}, style=${place.style}`);
        
        // RULE 1: interest must match (case-insensitive)
        const interestMatch = interests.some(userInterest => 
            userInterest.toLowerCase() === place.interest.toLowerCase()
        );

        // Rule 2: duration must match
        const durationMatch = place.duration === null || duration.some(userDuration =>
            userDuration.toLowerCase() === place.duration.toLowerCase()
        );

        // RUle 3: style must match
        const styleMatch = place.style === null || duration.some(userStyle =>
            userStyle.toLowerCase() === place.style.toLowerCase()
        );

        if (!interestMatch) {
            // haan u panpansinen detoyen haha for debugging lang ijay console
            console.log("Interest doesnt match");
            return;
        }

        // Rule 4: Budget must fit
        if (budget < place.min || budget > place.max) {
            console.log('Budget doesnt fit (${budget} not in ${place.min}-${place.max})');
            return;
        }

        if (!durationMatch) {
            console.log("duration does not match");
            return;
        }

        if (!styleMatch) {
            console.log("style does not match");
            return;
        }

        console.log(`Match found!`);
        results.push(place.id);
    });

    return results;
}

const placeInfo = {
    // CHURCHES DONE
    st_william_church: {
        name: "St. William Cathedral",
        city: "Laoag City, Ilocos Norte",
        img: "Images/Church/st_william.jpg",
        about: "Historic baroque cathedral located in Laoag."
    },
    santa_monica_church: {
        name: "Santa Monica Church",
        city: "Sarrat, Ilocos Norte",
        img: "Images/Church/santa_monica.jpg",
        about: "One of the largest churches in Ilocos."
    },
    san_nicolas_church: {
        name: "San Nicolas Church",
        city: "San Nicolas, Ilocos Norte",
        img: "Images/Church/san_nicolas_church.jpg",
        about: "A Spanish-era parish church."
    },
    paoay_church: {
        name: "Paoay Church",
        city: "Paoay, Ilocos Norte",
        img: "Images/Church/Paoay_Church.jpg",
        about: "A UNESCO World Heritage Site known for massive buttresses."
    },

    // HOTELS Done
    java_hotel: {
        name: "Java Hotel",
        city: "Laoag City, Ilocos Norte",
        img: "Images/Hotel/java_hotel.jpg",
        about: "A boutique hotel with Balinese-inspired design."
    },
    plaza_del_norte: {
        name: "Plaza Del Norte Hotel",
        city: "Laoag City, Ilocos Norte",
        img: "Images/Hotel/plaza_del_norte.jpg",
        about: "Elegant hotel near tourist attractions."
    },
    fort_ilocandia: {
        name: "Fort Ilocandia Resort",
        city: "Laoag City, Ilocos Norte",
        img: "Images/Hotel/fort_ilocandia.jpg",
        about: "A premium beachfront resort."
    },
    balay_travel_lodge: {
        name: "Balay Travel Lodge",
        city: "Laoag City, Ilocos Norte",
        img: "Images/Hotel/balay_travel_lodge.jpg",
        about: "Affordable and cozy lodge."
    },

    // BEACHES Done
    pagudpud_saud_beach: {
        name: "Saud Beach",
        city: "Pagudpud, Ilocos Norte",
        img: "Images/Beach/pagudpud_saud.jpg",
        about: "Clear waters and fine white sand."
    },
    blue_lagoon_pagudpud: {
        name: "Blue Lagoon",
        city: "Pagudpud, Ilocos Norte",
        img: "Images/Beach/blue_lagoon.jpg",
        about: "A beautiful deep-blue lagoon."
    },
    kapurpurawan_rock_formations: {
        name: "Kapurpurawan Rock Formations",
        city: "Burgos, Ilocos Norte",
        img: "Images/Beach/Kapurpurawan.jpg",
        about: "White limestone formations sculpted by nature."
    },
    currimao_beach: {
        name: "Currimao Beach",
        city: "Currimao, Ilocos Norte",
        img: "Images/Beach/currimao_beach.jpg",
        about: "A calm and peaceful beach."
    },

    // FALLS Done
    encantadora_falls: {
        name: "Encantadora Falls",
        city: "Pagudpud, Ilocos Norte",
        img: "Images/Falls/encantadora.jpg",
        about: "A hidden waterfall surrounded by forest."
    },
    kabigan_falls: {
        name: "Kabigan Falls",
        city: "Pagudpud, Ilocos Norte",
        img: "Images/Falls/kabigan_falls.jpg",
        about: "Beautiful falls requiring a scenic hike."
    },
    tanap_avis_falls: {
        name: "Tanap-Avis Falls",
        city: "Vintar, Ilocos Norte",
        img: "Images/Falls/avis_falls.jpg",
        about: "Cold natural pool and falls."
    },
    kingkong_falls: {
        name: "Kingkong Falls",
        city: "Adams, Ilocos Norte",
        img: "Images/Falls/kingkong.jpg",
        about: "Rock formations shaped like King Kong."
    },

    // CAFÉS Done
    cuisine_de_iloco: {
        name: "Cuisine de Iloco",
        city: "Laoag City, Ilocos Norte",
        img: "Images/Cafe/cuisine_de_iloco.jpg",
        about: "Authentic Ilocano food."
    },
    cafe_teria: {
        name: "Cafe-Teria",
        city: "Laoag City, Ilocos Norte",
        img: "Images/Cafe/cafe_teria.jpg",
        about: "Pastries and coffee spot."
    },
    cafe_ilocandia: {
        name: "Cafe Ilocandia",
        city: "Laoag City, Ilocos Norte",
        img: "Images/Cafe/cafe_ilocandia.jpg",
        about: "Relaxing café inside Fort Ilocandia."
    },
    art_cafe_pagudpud: {
        name: "Art Café",
        city: "Pagudpud, Ilocos Norte",
        img: "Images/Cafe/art_cafe.jpg",
        about: "Beachside café with artistic vibes."
    },

    // Mountains Done 2/2
    mount_sicapoo: {
        name: "Mt. Sicapoo",
        city: "Solsona, Ilocos Norte",
        img: "Images/Mountains/sicapoo.jpg",
        about: "awan ammok"
    },

    mount_lammin: {
        name: "Mt. Lammin",
        city: "Piddig, Ilocos Norte",
        img: "Images/Mountains/lammin.jpg",
        about: "..."
    },

    // Landmark Done
    patapat_viaduct: {
        name: "Patapat Viaduct",
        city: "Pagudpud, Ilocos Norte",
        img: "Images/Landmark/Patapat_Bridge.jpg",
        about: "2lay"
    },

    sand_dunes: {
        name: "La Paz Sand Dunes",
        city: "Paoay, Ilocos Norte",
        img: "Images/Landmark/sand_dunes.jpg",
        about: "Known for 4x4 rides and sandboarding."
    },

    bangui_windmills_park: {
        name: "Bangui Windmills",
        city: "Bangui, Ilocos Norte",
        img: "Images/Landmark/Windmill.jpg",
        about: "windmll haha"
    },

    malacanang_of_the_north: {
        name: "Malacanang of the North",
        city: "Paoay, Ilocos Norte",
        img: "Images/Landmark/malacanang_of_the_north.jpg",
        about: "some shit"
    }
};

function displayCards(places) {
    cardContainer.innerHTML = "";

    places.forEach(place => {
        const info = placeInfo[place];

        if (!info) {
            console.warn("Missing entry in placeInfo:", place);
            return;
        }

        cardContainer.innerHTML += `
            <div class="trip-card">
                <img src="${info.img}" class="trip-img" alt="${info.name}">
                <div class="trip-overlay">
                    <h3>${info.name}</h3>
                </div>
                <p class="trip-location">${info.city}</p>
                <p class="trip-time">Time: 8 Minutes</p>
                <p class="trip-about">About: ${info.about}</p>
            </div>
        `;
    });
}

let recommendedPlaces = runExpertSystem(selectedInterests, selectedBudget, selectedDuration, selectedStyle);

console.log("AI Recommended Places:", recommendedPlaces);

// no match 
if (recommendedPlaces.length === 0) {
    console.warn("No matches found");
    cardContainer.innerHTML = `
        <div class="no-results">
            <div class="no-results-emoji"></div>
            <h3>No trips match your Interest or Budget</h3>
            <p>Try adjusting your interests or budget and plan again!</p>
        </div>
    `;
} else {
    displayCards(recommendedPlaces);
}
