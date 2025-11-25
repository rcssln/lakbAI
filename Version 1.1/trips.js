(function(){
  // Utilities
  function haversineDistance(coord1, coord2) {
    const toRad = deg => deg * Math.PI / 180;
    const R = 6371; // km
    const dLat = toRad(coord2.lat - coord1.lat);
    const dLon = toRad(coord2.lng - coord1.lng);
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(toRad(coord1.lat)) * Math.cos(toRad(coord2.lat)) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // returns km
  }

  // transport modes: average speed (km/h) and cost per km (₱)
  const transportModes = {
    walking: { label: 'Walking', speed: 5, costPerKm: 0 },
    jeep: { label: 'Jeep/Tricycle', speed: 30, costPerKm: 1 },
    car: { label: 'Car', speed: 60, costPerKm: 6 },
    bus: { label: 'Bus', speed: 50, costPerKm: 3 }
  };

  // Default origin (Laoag City center) — this is the starting point for route planning.
  // You can change this or add UI for user's actual location later.
  const defaultOrigin = { lat: 18.1976, lng: 120.5928, name: 'Laoag City (default origin)' };

  // Load user choices
  let selectedInterests = JSON.parse(localStorage.getItem('selectedInterests') || '[]');
  let selectedBudget = Number(localStorage.getItem('selectedBudget') || '0');

  const cardContainer = document.getElementById('trip-cards');
  const controlsContainer = document.createElement('div');
  controlsContainer.className = 'trip-controls';

  // Sorting controls
  controlsContainer.innerHTML = `
    <div style="margin-bottom:12px; display:flex; gap:8px; align-items:center;">
      <label>Sort by:</label>
      <select id="sort-select">
        <option value="score">Recommended</option>
        <option value="distance">Distance (closest)</option>
        <option value="price">Estimated Price (low to high)</option>
      </select>
      <button id="show-itinerary-btn">Show Itinerary (selected)</button>
      <div style="margin-left:auto; font-size:0.9rem;">Origin: ${defaultOrigin.name}</div>
    </div>
  `;

  if (cardContainer) cardContainer.parentNode.insertBefore(controlsContainer, cardContainer);

  // Knowledge base with coords and price (entryFee) data
  const knowledgeBase = [
    { id: 'pagudpud_saud_beach', interest: 'beach', min:0, max:5000, coords:{lat:18.6110,lng:120.4359}, entryFee:0 },
    { id: 'blue_lagoon_pagudpud', interest: 'beach', min:0, max:5000, coords:{lat:18.6192,lng:120.4412}, entryFee:0 },
    { id: 'kapurpurawan_rock_formations', interest: 'beach', min:0, max:5000, coords:{lat:18.6218,lng:120.6215}, entryFee:50 },
    { id: 'currimao_beach', interest: 'beach', min:0, max:3000, coords:{lat:18.1166,lng:120.5663}, entryFee:0 },

    { id: 'kabigan_falls', interest: 'falls', min:0, max:5000, coords:{lat:18.6401,lng:120.4473}, entryFee:30 },
    { id: 'tanap_avis_falls', interest: 'falls', min:0, max:5000, coords:{lat:18.0123,lng:120.5300}, entryFee:20 },
    { id: 'encantadora_falls', interest: 'falls', min:0, max:1000, coords:{lat:18.6090,lng:120.4420}, entryFee:20 },
    { id: 'kingkong_falls', interest: 'falls', min:0, max:2000, coords:{lat:18.7000,lng:120.8000}, entryFee:15 },

    { id: 'paoay_church', interest: 'church', min:0, max:5000, coords:{lat:17.5733,lng:120.3931}, entryFee:20 },
    { id: 'st_william_church', interest: 'church', min:0, max:5000, coords:{lat:18.1970,lng:120.5924}, entryFee:0 },
    { id: 'santa_monica_church', interest: 'church', min:0, max:1000, coords:{lat:18.0390,lng:120.5315}, entryFee:0 },
    { id: 'san_nicolas_church', interest: 'church', min:0, max:2000, coords:{lat:18.1170,lng:120.5810}, entryFee:0 },

    { id: 'bangui_windmills_park', interest: 'landmark', min:0, max:5000, coords:{lat:18.6588,lng:120.4522}, entryFee:0 },
    { id: 'patapat_viaduct', interest: 'landmark', min:0, max:5000, coords:{lat:18.6329,lng:120.6462}, entryFee:0 },
    { id: 'malacanang_of_the_north', interest: 'landmark', min:0, max:3000, coords:{lat:17.5740,lng:120.3850}, entryFee:50 },
    { id: 'sand_dunes', interest: 'landmark', min:0, max:4000, coords:{lat:17.5842,lng:120.3608}, entryFee:400 },

    { id: 'mount_sicapoo', interest: 'mountains', min:0, max:3000, coords:{lat:17.9900,lng:120.6500}, entryFee:0 },
    { id: 'mount_lammin', interest: 'mountains', min:0, max:2000, coords:{lat:18.0500,lng:120.7000}, entryFee:0 },

    { id: 'cuisine_de_iloco', interest: 'cafe', min:0, max:2000, coords:{lat:18.1976,lng:120.5928}, entryFee:0 },
    { id: 'cafe_teria', interest: 'cafe', min:0, max:2000, coords:{lat:18.1990,lng:120.5935}, entryFee:0 },
    { id: 'cafe_ilocandia', interest: 'cafe', min:0, max:2000, coords:{lat:18.1950,lng:120.5900}, entryFee:0 },
    { id: 'art_cafe_pagudpud', interest: 'cafe', min:0, max:2000, coords:{lat:18.6200,lng:120.4400}, entryFee:0 },

    { id: 'java_hotel', interest: 'hotel', min:0, max:5000, coords:{lat:18.1975,lng:120.5960}, entryFee:0, nightly:1200 },
    { id: 'plaza_del_norte', interest: 'hotel', min:0, max:5000, coords:{lat:18.1960,lng:120.5980}, entryFee:0, nightly:1500 },
    { id: 'fort_ilocandia', interest: 'hotel', min:0, max:5000, coords:{lat:18.4050,lng:120.5870}, entryFee:0, nightly:3000 },
    { id: 'balay_travel_lodge', interest: 'hotel', min:0, max:5000, coords:{lat:18.1980,lng:120.5950}, entryFee:0, nightly:800 }
  ];

  // placeInfo remains for friendly display — keep your existing fields but ensure ids match knowledgeBase
  const placeInfo = {
    st_william_church: { name: 'St. William Cathedral', city: 'Laoag City, Ilocos Norte', img: 'Images/Church/st_william.jpg', about: 'Historic baroque cathedral located in Laoag.' },
    santa_monica_church: { name: 'Santa Monica Church', city: 'Sarrat, Ilocos Norte', img: 'Images/Church/santa_monica.jpg', about: 'One of the largest churches in Ilocos.' },
    san_nicolas_church: { name: 'San Nicolas Church', city: 'San Nicolas, Ilocos Norte', img: 'Images/Church/san_nicolas_church.jpg', about: 'A Spanish-era parish church.' },
    paoay_church: { name: 'Paoay Church', city: 'Paoay, Ilocos Norte', img: 'Images/Church/Paoay_Church.jpg', about: 'A UNESCO World Heritage Site known for massive buttresses.' },

    java_hotel: { name: 'Java Hotel', city: 'Laoag City, Ilocos Norte', img: 'Images/Hotel/java_hotel.jpg', about: 'A boutique hotel with Balinese-inspired design.' },
    plaza_del_norte: { name: 'Plaza Del Norte Hotel', city: 'Laoag City, Ilocos Norte', img: 'Images/Hotel/plaza_del_norte.jpg', about: 'Elegant hotel near tourist attractions.' },
    fort_ilocandia: { name: 'Fort Ilocandia Resort', city: 'Laoag City, Ilocos Norte', img: 'Images/Hotel/fort_ilocandia.jpg', about: 'A premium beachfront resort.' },
    balay_travel_lodge: { name: 'Balay Travel Lodge', city: 'Laoag City, Ilocos Norte', img: 'Images/Hotel/balay_travel_lodge.jpg', about: 'Affordable and cozy lodge.' },

    pagudpud_saud_beach: { name: 'Saud Beach', city: 'Pagudpud, Ilocos Norte', img: 'Images/Beach/pagudpud_saud.jpg', about: 'Clear waters and fine white sand.' },
    blue_lagoon_pagudpud: { name: 'Blue Lagoon', city: 'Pagudpud, Ilocos Norte', img: 'Images/Beach/blue_lagoon.jpg', about: 'A beautiful deep-blue lagoon.' },
    kapurpurawan_rock_formations: { name: 'Kapurpurawan Rock Formations', city: 'Burgos, Ilocos Norte', img: 'Images/Beach/Kapurpurawan.jpg', about: 'White limestone formations sculpted by nature.' },
    currimao_beach: { name: 'Currimao Beach', city: 'Currimao, Ilocos Norte', img: 'Images/Beach/currimao_beach.jpg', about: 'A calm and peaceful beach.' },

    encantadora_falls: { name: 'Encantadora Falls', city: 'Pagudpud, Ilocos Norte', img: 'Images/Falls/encantadora.jpg', about: 'A hidden waterfall surrounded by forest.' },
    kabigan_falls: { name: 'Kabigan Falls', city: 'Pagudpud, Ilocos Norte', img: 'Images/Falls/kabigan_falls.jpg', about: 'Beautiful falls requiring a scenic hike.' },
    tanap_avis_falls: { name: 'Tanap-Avis Falls', city: 'Vintar, Ilocos Norte', img: 'Images/Falls/avis_falls.jpg', about: 'Cold natural pool and falls.' },
    kingkong_falls: { name: 'Kingkong Falls', city: 'Adams, Ilocos Norte', img: 'Images/Falls/kingkong.jpg', about: 'Rock formations shaped like King Kong.' },

    cuisine_de_iloco: { name: 'Cuisine de Iloco', city: 'Laoag City, Ilocos Norte', img: 'Images/Cafe/cuisine_de_iloco.jpg', about: 'Authentic Ilocano food.' },
    cafe_teria: { name: 'Cafe-Teria', city: 'Laoag City, Ilocos Norte', img: 'Images/Cafe/cafe_teria.jpg', about: 'Pastries and coffee spot.' },
    cafe_ilocandia: { name: 'Cafe Ilocandia', city: 'Laoag City, Ilocos Norte', img: 'Images/Cafe/cafe_ilocandia.jpg', about: 'Relaxing café inside Fort Ilocandia.' },
    art_cafe_pagudpud: { name: 'Art Café', city: 'Pagudpud, Ilocos Norte', img: 'Images/Cafe/art_cafe.jpg', about: 'Beachside café with artistic vibes.' },

    mount_sicapoo: { name: 'Mt. Sicapoo', city: 'Solsona, Ilocos Norte', img: 'Images/Mountains/sicapoo.jpg', about: 'A scenic mountain for hiking.' },
    mount_lammin: { name: 'Mt. Lammin', city: 'Piddig, Ilocos Norte', img: 'Images/Mountains/lammin.jpg', about: 'Challenging climb.' },

    patapat_viaduct: { name: 'Patapat Viaduct', city: 'Pagudpud, Ilocos Norte', img: 'Images/Landmark/Patapat_Bridge.jpg', about: 'Scenic coastal viaduct.' },
    sand_dunes: { name: 'La Paz Sand Dunes', city: 'Paoay, Ilocos Norte', img: 'Images/Landmark/sand_dunes.jpg', about: 'Known for 4x4 rides and sandboarding.' },
    bangui_windmills_park: { name: 'Bangui Windmills', city: 'Bangui, Ilocos Norte', img: 'Images/Landmark/Windmill.jpg', about: 'Wind farm and landmark.' },
    malacanang_of_the_north: { name: 'Malacanang of the North', city: 'Paoay, Ilocos Norte', img: 'Images/Landmark/malacanang_of_the_north.jpg', about: 'Heritage site.' }
  };

  // Filter and scoring engine
  function scorePlace(place, interests, budget, origin) {
    // interest match score (1 if matches at least one interest, plus bonus if multiple)
    const interestMatch = interests.some(i => i.toLowerCase() === place.interest.toLowerCase());
    if (!interestMatch) return null; // not eligible

    // budget fit (0 = perfect, >0 = penalty)
    let budgetPenalty = 0;
    if (budget < place.min) budgetPenalty += (place.min - budget) * 2; // heavy penalty if budget too low
    if (budget > place.max) budgetPenalty += (budget - place.max) * 0.5; // moderate penalty if budget is much higher than max (assume costlier options)

    // distance
    const dist = haversineDistance(origin, place.coords); // km

    // estimated travel cost (assume car cost per km 6 php) and entry fee
    const travelCostEstimate = dist * transportModes.car.costPerKm; // base travel cost by car
    const estimatedTotal = (place.entryFee || 0) + travelCostEstimate + (place.nightly || 0);

    // score: lower is better; combine distance + budget penalty + estimatedTotal scaled
    const score = dist * 1.2 + budgetPenalty * 0.01 + (estimatedTotal / 100);

    return { id: place.id, dist, estimatedTotal, score, place };
  }

  function runExpertSystem(interests, budget, origin) {
    const results = [];
    knowledgeBase.forEach(place => {
      const r = scorePlace(place, interests, budget, origin);
      if (r) results.push(r);
    });
    return results;
  }

  // Recommend combos: group by interest and pick top N per interest
  function recommendCombos(scoredResults, perInterest = 2) {
    const byInterest = {};
    scoredResults.forEach(r => {
      const key = r.place.interest;
      if (!byInterest[key]) byInterest[key] = [];
      byInterest[key].push(r);
    });

    const combos = [];
    Object.keys(byInterest).forEach(key => {
      const arr = byInterest[key].sort((a,b)=>a.score-b.score).slice(0, perInterest);
      combos.push(...arr);
    });

    // Also add top overall matches
    const topOverall = scoredResults.sort((a,b)=>a.score-b.score).slice(0,5);
    topOverall.forEach(t => { if (!combos.find(c => c.id===t.id)) combos.push(t); });

    return combos;
  }

  // Display functions
  function createCardHtml(info, meta) {
    const est = Math.round(meta.estimatedTotal);
    const distKm = meta.dist.toFixed(1);
    return `
      <div class="trip-card" data-id="${meta.id}">
        <img src="${info.img}" class="trip-img" alt="${info.name}">
        <div class="trip-overlay"><h3>${info.name}</h3></div>
        <p class="trip-location">${info.city}</p>
        <p class="trip-distance">Distance: ${distKm} km</p>
        <p class="trip-time">Est. Travel Cost: ₱${est}</p>
        <p class="trip-about">${info.about}</p>
        <button class="add-to-itin">Add to itinerary</button>
      </div>
    `;
  }

  function displayCardsFromScored(scoredArr) {
    if (!cardContainer) return;
    if (scoredArr.length === 0) {
      cardContainer.innerHTML = `\
        <div class="no-results">\
          <h3>No trips match your Interest or Budget</h3>\
          <p>Try adjusting your interests or budget and plan again!</p>\
        </div>`;
      return;
    }

    cardContainer.innerHTML = scoredArr.map(s => createCardHtml(placeInfo[s.id], s)).join('');

    // attach click handlers
    document.querySelectorAll('.trip-card').forEach(card => {
      const id = card.getAttribute('data-id');
      card.addEventListener('click', (e) => {
        // If clicked the Add button specifically
        if (e.target.classList.contains('add-to-itin')) {
          addToItinerary(id);
          e.stopPropagation();
          return;
        }
        // Otherwise show details + transport choices from origin
        showPlaceModal(id);
      });
    });
  }

  // Itinerary management
  let itinerary = []; // ordered array of place ids

  function addToItinerary(id) {
    if (itinerary.includes(id)) {
      alert('Already in itinerary');
      return;
    }
    itinerary.push(id);
    alert('Added to itinerary: ' + (placeInfo[id]?.name || id));
    renderItineraryMini();
  }

  function renderItineraryMini() {
    let mini = document.getElementById('itinerary-mini');
    if (!mini) {
      mini = document.createElement('div');
      mini.id = 'itinerary-mini';
      mini.style.border = '1px solid #ddd';
      mini.style.padding = '8px';
      mini.style.marginTop = '8px';
      controlsContainer.appendChild(mini);
    }
    mini.innerHTML = '<strong>Itinerary (click to remove):</strong><br/>' +
      itinerary.map((id, idx) => `<span style="cursor:pointer;margin-right:8px;" data-id="${id}">${idx+1}. ${placeInfo[id].name}</span>`).join('');

    mini.querySelectorAll('span[data-id]').forEach(span => {
      span.addEventListener('click', () => {
        const id = span.getAttribute('data-id');
        itinerary = itinerary.filter(x => x !== id);
        renderItineraryMini();
      });
    });
  }

  // Modal for place details and initial transport selection
  function showPlaceModal(id) {
    const info = placeInfo[id];
    const kb = knowledgeBase.find(k=>k.id===id);
    if (!info || !kb) return;

    // create overlay
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.style.position = 'fixed'; overlay.style.top='0'; overlay.style.left='0'; overlay.style.right='0'; overlay.style.bottom='0';
    overlay.style.background='rgba(0,0,0,0.5)'; overlay.style.display='flex'; overlay.style.alignItems='center'; overlay.style.justifyContent='center';

    const box = document.createElement('div');
    box.style.background='#fff'; box.style.padding='16px'; box.style.maxWidth='480px'; box.style.width='90%'; box.style.borderRadius='8px';

    const distFromOrigin = haversineDistance(defaultOrigin, kb.coords).toFixed(1);
    box.innerHTML = `
      <h3>${info.name}</h3>
      <p>${info.city}</p>
      <p>${info.about}</p>
      <p>Distance from origin: ${distFromOrigin} km</p>
      <label>Choose transport from origin:</label>
      <div id="transport-opts">
        ${Object.keys(transportModes).map(m=>`<label style="margin-right:8px;"><input type=radio name="transport" value="${m}" ${m==='car'?'checked':''}/> ${transportModes[m].label}</label>`).join('')}
      </div>
      <div style="margin-top:12px; display:flex; gap:8px; justify-content:flex-end;">
        <button id="close-modal">Close</button>
        <button id="add-and-transport">Add to itinerary + set transport</button>
      </div>
    `;

    overlay.appendChild(box);
    document.body.appendChild(overlay);

    overlay.querySelector('#close-modal').addEventListener('click', ()=>document.body.removeChild(overlay));

    overlay.querySelector('#add-and-transport').addEventListener('click', ()=>{
      const transport = overlay.querySelector('input[name="transport"]:checked').value;
      // store transport preference for this place (for origin->place leg)
      transportPrefs[id] = transportPrefs[id] || {};
      transportPrefs[id].fromOrigin = transport;
      addToItinerary(id);
      document.body.removeChild(overlay);
    });
  }

  // transportPrefs holds per-leg transport choices; we'll keep per-place preferences for simplicity
  // e.g., transportPrefs[placeId] = { fromOrigin: 'car', toNext: 'jeep' }
  const transportPrefs = {};

  // Build route (nearest-neighbor heuristic) starting at origin
  function buildRoute(origin, placeIds) {
    const remaining = placeIds.slice();
    const route = [];
    let current = { id: '__origin__', coords: origin };

    while (remaining.length > 0) {
      let bestIdx = 0;
      let bestDist = Infinity;
      for (let i=0;i<remaining.length;i++) {
        const pid = remaining[i];
        const kb = knowledgeBase.find(k=>k.id===pid);
        if (!kb) continue;
        const d = haversineDistance(current.coords, kb.coords);
        if (d < bestDist) { bestDist = d; bestIdx = i; }
      }
      const nextId = remaining.splice(bestIdx,1)[0];
      route.push(nextId);
      current = { id: nextId, coords: knowledgeBase.find(k=>k.id===nextId).coords };
    }
    return route;
  }

  // Compute route metrics (total distance, time, cost) given transport choices
  function computeRouteMetrics(origin, orderedPlaceIds, transportPrefsLocal) {
    let totalDistance = 0;
    let totalTimeHours = 0;
    let totalCost = 0;

    let currentCoords = origin;
    for (let i=0;i<orderedPlaceIds.length;i++) {
      const pid = orderedPlaceIds[i];
      const kb = knowledgeBase.find(k=>k.id===pid);
      const dist = haversineDistance(currentCoords, kb.coords);
      totalDistance += dist;

      // determine transport for this leg: prefer stored pref for destination (fromOrigin for first leg, or toNext for subsequent legs)
      let transportKey = 'car';
      if (i===0 && transportPrefsLocal[pid] && transportPrefsLocal[pid].fromOrigin) {
        transportKey = transportPrefsLocal[pid].fromOrigin;
      } else if (i>0 && transportPrefsLocal[orderedPlaceIds[i-1]] && transportPrefsLocal[orderedPlaceIds[i-1]].toNext) {
        transportKey = transportPrefsLocal[orderedPlaceIds[i-1]].toNext;
      }

      const tmode = transportModes[transportKey] || transportModes.car;
      const timeH = dist / tmode.speed; // hours
      totalTimeHours += timeH;
      totalCost += (dist * tmode.costPerKm);

      // entry / nightly cost
      totalCost += (kb.entryFee || 0) + (kb.nightly || 0);

      currentCoords = kb.coords;
    }

    return { totalDistance, totalTimeHours, totalCost };
  }

  // Show itinerary modal with ability to pick transport for each leg and show recommended shortest path
  function showItineraryModal() {
    if (itinerary.length === 0) { alert('Your itinerary is empty. Add places first.'); return; }

    // Build route using NN heuristic
    const route = buildRoute(defaultOrigin, itinerary.slice());

    // create modal
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.style.position = 'fixed'; overlay.style.top='0'; overlay.style.left='0'; overlay.style.right='0'; overlay.style.bottom='0';
    overlay.style.background='rgba(0,0,0,0.5)'; overlay.style.display='flex'; overlay.style.alignItems='center'; overlay.style.justifyContent='center';

    const box = document.createElement('div');
    box.style.background='#fff'; box.style.padding='16px'; box.style.maxWidth='720px'; box.style.width='95%'; box.style.borderRadius='8px'; box.style.maxHeight='80vh'; box.style.overflow='auto';

    box.innerHTML = `<h3>Itinerary & Route Recommendation</h3>`;

    // list route and transport selectors for each leg
    let html = '<ol>';
    let prev = { id: '__origin__', coords: defaultOrigin };
    route.forEach((pid, idx) => {
      const kb = knowledgeBase.find(k=>k.id===pid);
      const name = placeInfo[pid].name;
      const dist = haversineDistance(prev.coords, kb.coords).toFixed(1);
      const prefFromPrev = (transportPrefs[pid] && transportPrefs[pid].fromOrigin) || 'car';

      html += `<li style="margin-bottom:10px;"><strong>${name}</strong> — ${dist} km<br/>Transport: `;
      html += `<select data-leg="${idx}" class="leg-transport">` +
        Object.keys(transportModes).map(m => `<option value="${m}" ${m===prefFromPrev?'selected':''}>${transportModes[m].label}</option>`).join('') +
      `</select></li>`;

      prev = kb;
    });
    html += '</ol>';

    box.innerHTML += html;

    box.innerHTML += `<div style="display:flex; gap:8px; justify-content:flex-end; margin-top:12px;">
      <button id="close-itin">Close</button>
      <button id="compute-route">Compute Metrics & Recommend Shortest</button>
    </div>`;

    overlay.appendChild(box);
    document.body.appendChild(overlay);

    overlay.querySelector('#close-itin').addEventListener('click', ()=>document.body.removeChild(overlay));

    overlay.querySelector('#compute-route').addEventListener('click', ()=>{
      // read transport selections and store as transportPrefs for each place
      const selects = overlay.querySelectorAll('.leg-transport');
      selects.forEach((sel, idx) => {
        const val = sel.value;
        const pid = route[idx];
        transportPrefs[pid] = transportPrefs[pid] || {};
        // for first leg store as fromOrigin; for others store as toNext on previous
        if (idx === 0) transportPrefs[pid].fromOrigin = val;
        else transportPrefs[route[idx-1]].toNext = val;
      });

      // Compute metrics for current NN route
      const metrics = computeRouteMetrics(defaultOrigin, route, transportPrefs);

      // Also try alternative small permutation search to try to improve distance (only if small itinerary)
      let bestRoute = route.slice();
      let bestMetrics = metrics;
      if (itinerary.length <= 7) { // brute force reasonable upto 7!
        // Try all permutations of itinerary (careful with compute cost)
        const permute = (arr) => {
          if (arr.length === 1) return [arr];
          const out = [];
          for (let i=0;i<arr.length;i++) {
            const rest = arr.slice(0,i).concat(arr.slice(i+1));
            permute(rest).forEach(p => out.push([arr[i]].concat(p)));
          }
          return out;
        };
        const perms = permute(itinerary);
        perms.forEach(p => {
          const m = computeRouteMetrics(defaultOrigin, p, transportPrefs);
          if (m.totalDistance < bestMetrics.totalDistance) {
            bestMetrics = m; bestRoute = p.slice();
          }
        });
      }

      // Show results
      const resultsHtml = `\
        <h4>Results</h4>\
        <p>Recommended route (optimized): <strong>${bestRoute.map(id=>placeInfo[id].name).join(' → ')}</strong></p>\
        <p>Total Distance: ${bestMetrics.totalDistance.toFixed(1)} km</p>\
        <p>Estimated Travel Time: ${(bestMetrics.totalTimeHours*60).toFixed(0)} minutes</p>\
        <p>Estimated Total Cost (travel + entry/night): ₱${Math.round(bestMetrics.totalCost)}</p>\
      `;
        const resultsDiv = document.createElement("div");
        resultsDiv.innerHTML = resultsHtml;
        box.appendChild(resultsDiv);

    });
  }

  // Hook "Show Itinerary" button
  document.getElementById('show-itinerary-btn').addEventListener('click', showItineraryModal);

  // Initial run
  const scored = runExpertSystem(selectedInterests, selectedBudget, defaultOrigin);
  // recommend combos and then unique-ify keeping best score
  let combos = recommendCombos(scored, 2);

  // Sort default by score
  combos.sort((a,b) => a.score - b.score);
  displayCardsFromScored(combos);

  // Sorting select behaviour
  const sortSelect = document.getElementById('sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      const v = sortSelect.value;
      let arr = combos.slice();
      if (v === 'distance') arr.sort((a,b)=>a.dist-b.dist);
      else if (v === 'price') arr.sort((a,b)=>a.estimatedTotal - b.estimatedTotal);
      else arr.sort((a,b)=>a.score-b.score);
      displayCardsFromScored(arr);
    });
  }

  // Expose some things to console for debugging
  window._lakbai = { knowledgeBase, placeInfo, scored: combos, itinerary, addToItinerary, transportPrefs };

})();