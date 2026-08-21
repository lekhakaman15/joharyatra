import './style.css'

/* ============================================
   JOHARYATRA — Main Application Logic
   ============================================ */

// ---- Data ----
let destinationsData = []
let journeyData = []
let featuresData = []
let cultureData = []
let marketplaceData = []
let plannerData = []
let faqData = []

// ---- State ----
let map = null
let markersLayer = null
let selectedPrefs = new Set()
let selectedDuration = null
let selectedBudget = null
let impactChart = null
let communityChart = null
let cultureTab = 'stories'
let marketTab = 'artisans'

// ---- Static content ----
const whyCards = [
  { icon: 'leaf', title: 'Promotes Eco & Cultural Tourism', desc: 'Showcases Jharkhand\'s hidden natural and cultural gems to the world.' },
  { icon: 'users', title: 'Empowers Local Communities', desc: 'Connects travelers directly with tribal villages and local hosts.' },
  { icon: 'store', title: 'Supports Local Business & Artisans', desc: 'A marketplace for handicrafts, guides, and homestays — no middlemen.' },
  { icon: 'landmark', title: 'Preserves Culture & Traditions', desc: 'Digital archive of stories, festivals, music, and tribal heritage.' },
  { icon: 'sprout', title: 'Encourages Sustainable Travel', desc: 'Eco Score and gamified badges reward responsible, low-impact travel.' },
]

const uniqueElements = [
  { icon: 'book-open', title: 'Story Mode', desc: 'Discover the story behind every place — myths, legends, and living history.' },
  { icon: 'mic', title: 'Tribal Voice', desc: 'Listen to local people and their culture in their own words and songs.' },
  { icon: 'gauge', title: 'Eco Impact Meter', desc: 'See how your trip helps nature and communities — in real, measurable numbers.' },
  { icon: 'award', title: 'Collect & Explore', desc: 'Earn badges as you explore — gamified discovery that keeps you coming back.' },
  { icon: 'video', title: 'Virtual Preview', desc: '360° image and video previews let you experience a place before you arrive.' },
]

const techStack = [
  { icon: 'code', label: 'HTML' },
  { icon: 'palette', label: 'CSS' },
  { icon: 'braces', label: 'JavaScript' },
  { icon: 'map-pin', label: 'Leaflet + OSM' },
  { icon: 'database', label: 'JSON Data' },
  { icon: 'bar-chart', label: 'Chart.js' },
  { icon: 'edit', label: 'VS Code' },
  { icon: 'github', label: 'GitHub Pages' },
]

const winReasons = [
  'Solves a real problem with a real impact',
  'Highly creative & socially responsible',
  'User friendly + visually beautiful',
  'Easy to demonstrate & understand',
  'Scalable idea for future with AI, Blockchain, AR/VR',
  'Zero cost & lightweight — accessible for all',
]

const futureRoadmap = [
  { num: '01', title: 'AI Trip Planner', desc: 'Machine learning itineraries that adapt to your style, weather, and real-time crowd data.' },
  { num: '02', title: 'Blockchain Certificates', desc: 'Tamper-proof digital verification for guides, homestays, and artisan authenticity.' },
  { num: '03', title: 'AR/VR Experiences', desc: 'Immersive 360° previews and augmented reality storytelling at every destination.' },
  { num: '04', title: 'Real-time Transport', desc: 'Live bus, train, and shared-taxi integration for seamless last-mile connectivity.' },
  { num: '05', title: 'Multi-language Chatbot', desc: 'AI chatbot in Hindi, English, Santhali, Mundari, and more — for every traveler.' },
]

const taglines = [
  'Explore Jharkhand. Experience its Soul.',
  'Travel Green. Empower Local. Preserve Culture.',
  'One Journey. Many Stories.',
  'JoharYatra — More than a Trip, It\'s a Connection.',
]

// ---- Init ----
async function loadData() {
  const [dest, jour, feat, cult, mkt, pln, faq] = await Promise.all([
    fetch('data/destinations.json').then(r => r.json()),
    fetch('data/journey.json').then(r => r.json()),
    fetch('data/features.json').then(r => r.json()),
    fetch('data/culture.json').then(r => r.json()),
    fetch('data/marketplace.json').then(r => r.json()),
    fetch('data/planner.json').then(r => r.json()),
    fetch('data/faq.json').then(r => r.json()),
  ])
  destinationsData = dest.destinations
  journeyData = jour.steps
  featuresData = feat.features
  cultureData = cult
  marketplaceData = mkt
  plannerData = pln
  faqData = faq.faqs
}

// ---- Render functions ----
function renderWhyCards() {
  const grid = document.getElementById('whyGrid')
  grid.innerHTML = whyCards.map(card => `
    <div class="why-card reveal">
      <div class="why-icon"><i data-lucide="${card.icon}"></i></div>
      <h3>${card.title}</h3>
      <p>${card.desc}</p>
    </div>
  `).join('')
}

function renderJourney() {
  const grid = document.getElementById('journeyGrid')
  grid.innerHTML = journeyData.map(step => `
    <div class="journey-card reveal">
      <div class="journey-icon"><i data-lucide="${step.icon}"></i></div>
      <div class="journey-num">${step.id}</div>
      <h3>${step.title}</h3>
      <p>${step.desc}</p>
    </div>
  `).join('')
}

function renderFeatures() {
  const grid = document.getElementById('featuresGrid')
  grid.innerHTML = featuresData.map(f => `
    <div class="feature-card reveal" data-color="${f.color}">
      <div class="feature-icon"><i data-lucide="${f.icon}"></i></div>
      <h3>${f.title}</h3>
      <p>${f.desc}</p>
    </div>
  `).join('')
}

function renderDestinations() {
  const list = document.getElementById('destinationsList')
  list.innerHTML = destinationsData.map(d => `
    <div class="dest-card reveal" data-id="${d.id}">
      <img src="${d.image}" alt="${d.name}" loading="lazy" />
      <div class="dest-card-body">
        <h3>${d.name}</h3>
        <div class="dest-type">${d.category}</div>
        <p>${d.shortDesc}</p>
      </div>
    </div>
  `).join('')

  list.querySelectorAll('.dest-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = parseInt(card.dataset.id)
      const dest = destinationsData.find(d => d.id === id)
      list.querySelectorAll('.dest-card').forEach(c => c.classList.remove('active'))
      card.classList.add('active')
      flyToDestination(dest)
      showMapInfo(dest)
    })
  })
}

function renderUnique() {
  const grid = document.getElementById('uniqueGrid')
  grid.innerHTML = uniqueElements.map(el => `
    <div class="unique-card reveal">
      <div class="unique-icon"><i data-lucide="${el.icon}"></i></div>
      <h3>${el.title}</h3>
      <p>${el.desc}</p>
    </div>
  `).join('')
}

function renderTech() {
  const badges = document.getElementById('techBadges')
  badges.innerHTML = techStack.map(t => `
    <span class="tech-badge"><i data-lucide="${t.icon}"></i> ${t.label}</span>
  `).join('')
}

function renderWin() {
  const grid = document.getElementById('winGrid')
  grid.innerHTML = winReasons.map(r => `
    <div class="win-item reveal">
      <div class="win-check"><i data-lucide="check"></i></div>
      <p>${r}</p>
    </div>
  `).join('')
}

function renderFuture() {
  const timeline = document.getElementById('futureTimeline')
  timeline.innerHTML = futureRoadmap.map(f => `
    <div class="future-item reveal">
      <div class="future-num">${f.num}</div>
      <h4>${f.title}</h4>
      <p>${f.desc}</p>
    </div>
  `).join('')
}

function renderTaglines() {
  const grid = document.getElementById('taglineGrid')
  grid.innerHTML = taglines.map(t => `
    <div class="tagline-card reveal">
      <p>${t}</p>
    </div>
  `).join('')
}

// ---- Map ----
function initMap() {
  map = L.map('map', { scrollWheelZoom: false }).setView([23.6, 85.3], 7)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 18,
  }).addTo(map)

  markersLayer = L.layerGroup().addTo(map)

  destinationsData.forEach(d => {
    const marker = L.marker([d.lat, d.lng]).addTo(markersLayer)
    marker.bindPopup(`
      <div class="popup-content">
        <img src="${d.image}" alt="${d.name}" />
        <div class="popup-body">
          <h4>${d.name}</h4>
          <p>${d.shortDesc}</p>
        </div>
      </div>
    `)
    marker.on('click', () => {
      showMapInfo(d)
      document.querySelectorAll('.dest-card').forEach(c => {
        c.classList.toggle('active', parseInt(c.dataset.id) === d.id)
      })
    })
  })
}

function flyToDestination(dest) {
  map.flyTo([dest.lat, dest.lng], 10, { duration: 1.2 })
  markersLayer.eachLayer(layer => {
    if (layer.getLatLng().lat === dest.lat && layer.getLatLng().lng === dest.lng) {
      layer.openPopup()
    }
  })
}

function showMapInfo(dest) {
  const info = document.getElementById('mapInfo')
  info.innerHTML = `<i data-lucide="map-pin"></i><span><strong>${dest.name}</strong> — ${dest.category} • ${dest.shortDesc}</span>`
  lucide.createIcons()
}

// ---- Trip Planner ----
function renderPlanner() {
  const prefsEl = document.getElementById('prefChips')
  prefsEl.innerHTML = plannerData.preferences.map(p => `
    <span class="chip" data-pref="${p.id}"><i data-lucide="${p.icon}"></i> ${p.label}</span>
  `).join('')

  const durEl = document.getElementById('durationChips')
  durEl.innerHTML = plannerData.durations.map(d => `
    <span class="chip" data-duration="${d.id}">${d.label}</span>
  `).join('')

  const budgetEl = document.getElementById('budgetChips')
  budgetEl.innerHTML = plannerData.budgets.map(b => `
    <span class="chip" data-budget="${b.id}">${b.label}</span>
  `).join('')

  document.querySelectorAll('[data-pref]').forEach(chip => {
    chip.addEventListener('click', () => {
      const pref = chip.dataset.pref
      if (selectedPrefs.has(pref)) {
        selectedPrefs.delete(pref)
        chip.classList.remove('selected')
      } else {
        selectedPrefs.add(pref)
        chip.classList.add('selected')
      }
    })
  })

  document.querySelectorAll('[data-duration]').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('[data-duration]').forEach(c => c.classList.remove('selected'))
      chip.classList.add('selected')
      selectedDuration = plannerData.durations.find(d => d.id === chip.dataset.duration)
    })
  })

  document.querySelectorAll('[data-budget]').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('[data-budget]').forEach(c => c.classList.remove('selected'))
      chip.classList.add('selected')
      selectedBudget = plannerData.budgets.find(b => b.id === chip.dataset.budget)
    })
  })

  document.getElementById('generateItinerary').addEventListener('click', generateItinerary)
}

function generateItinerary() {
  if (selectedPrefs.size === 0 || !selectedDuration || !selectedBudget) {
    showPlannerError('Please select at least one interest, a duration, and a budget.')
    return
  }

  // Rule-based engine: match prefs to destination IDs
  const destIds = new Set()
  selectedPrefs.forEach(pref => {
    const ids = plannerData.rules[pref] || []
    ids.forEach(id => destIds.add(id))
  })

  const matched = destinationsData.filter(d => destIds.has(d.id))
  const days = selectedDuration.days
  const budgetLabel = plannerData.budgets.find(b => b.id === selectedBudget.id).label

  // Distribute destinations across days
  const perDay = Math.max(1, Math.ceil(matched.length / days))
  const dayPlans = []
  for (let i = 0; i < days; i++) {
    const dayDests = matched.slice(i * perDay, (i + 1) * perDay)
    if (dayDests.length > 0) dayPlans.push(dayDests)
  }

  // If fewer destinations than days, repeat with rest days
  while (dayPlans.length < days) {
    dayPlans.push([{ restDay: true, name: 'Rest & Explore Local Culture' }])
  }

  renderItinerary(dayPlans, budgetLabel)
}

function showPlannerError(msg) {
  const result = document.getElementById('plannerResult')
  result.innerHTML = `
    <div class="planner-placeholder" style="color: var(--terra-500);">
      <i data-lucide="alert-circle"></i>
      <p>${msg}</p>
    </div>
  `
  lucide.createIcons()
}

function renderItinerary(dayPlans, budgetLabel) {
  const result = document.getElementById('plannerResult')
  const totalDests = dayPlans.flat().filter(d => !d.restDay).length
  const estCost = selectedBudget.level * selectedDuration.days * 3000

  let html = `
    <div class="itinerary-summary">
      <h4><i data-lucide="route" style="width:16px;height:16px;display:inline;vertical-align:middle;"></i> Your Personalized Itinerary</h4>
      <div class="itinerary-summary-row"><span>Duration</span><strong>${selectedDuration.label}</strong></div>
      <div class="itinerary-summary-row"><span>Destinations</span><strong>${totalDests}</strong></div>
      <div class="itinerary-summary-row"><span>Budget</span><strong>${budgetLabel}</strong></div>
      <div class="itinerary-summary-row"><span>Est. Cost</span><strong>₹${estCost.toLocaleString('en-IN')}</strong></div>
    </div>
  `

  dayPlans.forEach((day, i) => {
    html += `<div class="itinerary-day">`
    html += `<div class="itinerary-day-header"><span class="day-badge">${i + 1}</span><h4>Day ${i + 1}</h4></div>`
    day.forEach(dest => {
      if (dest.restDay) {
        html += `
          <div class="itinerary-item">
            <i data-lucide="coffee"></i>
            <div class="itinerary-item-text">
              <h5>Rest & Local Culture</h5>
              <p>Explore local markets, try regional cuisine, and connect with the community.</p>
            </div>
          </div>
        `
      } else {
        html += `
          <div class="itinerary-item">
            <i data-lucide="map-pin"></i>
            <div class="itinerary-item-text">
              <h5>${dest.name}</h5>
              <p>${dest.shortDesc}</p>
            </div>
          </div>
        `
      }
    })
    html += `</div>`
  })

  html += `
    <div class="itinerary-summary" style="background: var(--gold-50);">
      <h4><i data-lucide="leaf" style="width:16px;height:16px;display:inline;vertical-align:middle;"></i> Eco Tip</h4>
      <p style="font-size:0.85rem;color:var(--text-muted);">Choose local homestays and buy from artisans to maximize your Eco Score and community impact.</p>
    </div>
  `

  result.innerHTML = html
  lucide.createIcons()
  result.scrollTop = 0
}

// ---- Culture Hub ----
function renderCulture() {
  renderCultureTab(cultureTab)
}

function renderCultureTab(tab) {
  cultureTab = tab
  const content = document.getElementById('cultureContent')

  if (tab === 'stories') {
    content.innerHTML = cultureData.stories.map(s => `
      <div class="story-card reveal" data-story="${s.id}">
        <img src="${s.image}" alt="${s.title}" loading="lazy" />
        <div class="story-body">
          <div class="story-category">${s.category}</div>
          <h3>${s.title}</h3>
          <p>${s.excerpt}</p>
          <span class="story-read-more">Read story <i data-lucide="arrow-right"></i></span>
        </div>
      </div>
    `).join('')

    content.querySelectorAll('.story-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = parseInt(card.dataset.story)
        const story = cultureData.stories.find(s => s.id === id)
        openStoryModal(story)
      })
    })
  } else if (tab === 'festivals') {
    content.innerHTML = cultureData.festivals.map(f => `
      <div class="festival-card reveal">
        <div class="festival-icon"><i data-lucide="party-popper"></i></div>
        <h3>${f.name}</h3>
        <div class="festival-month">${f.month}</div>
        <p>${f.desc}</p>
      </div>
    `).join('')
  } else if (tab === 'tribes') {
    content.innerHTML = cultureData.tribes.map(t => `
      <div class="tribe-card reveal">
        <div class="tribe-header">
          <div class="tribe-emblem">${t.name.charAt(0)}</div>
          <div>
            <h3>${t.name}</h3>
            <div class="tribe-pop">${t.population}</div>
          </div>
        </div>
        <div class="tribe-region">${t.region}</div>
        <p>${t.known}</p>
      </div>
    `).join('')
  }

  lucide.createIcons()
}

function openStoryModal(story) {
  const modal = document.getElementById('modal')
  const content = document.getElementById('modalContent')
  content.innerHTML = `
    <img src="${story.image}" alt="${story.title}" class="modal-image" />
    <div class="modal-category">${story.category}</div>
    <h2 class="modal-title">${story.title}</h2>
    <p class="modal-body">${story.body}</p>
  `
  modal.classList.add('active')
  lucide.createIcons()
}

// ---- Marketplace ----
function renderMarketplace() {
  renderMarketTab(marketTab)
}

function renderMarketTab(tab) {
  marketTab = tab
  const content = document.getElementById('marketplaceContent')

  if (tab === 'artisans') {
    content.innerHTML = marketplaceData.artisans.map(a => `
      <div class="artisan-card reveal">
        <img src="${a.image}" alt="${a.name}" loading="lazy" />
        <div class="artisan-body">
          ${a.verified ? '<span class="verified-badge"><i data-lucide="badge-check"></i> Verified</span>' : ''}
          <h3>${a.name}</h3>
          <div class="artisan-name">by ${a.artisan} • ${a.village}</div>
          <p>${a.desc}</p>
          <div class="artisan-price">${a.price}</div>
        </div>
      </div>
    `).join('')
  } else if (tab === 'guides') {
    content.innerHTML = marketplaceData.guides.map(g => `
      <div class="guide-card reveal">
        <div class="guide-body">
          ${g.verified ? '<span class="verified-badge"><i data-lucide="badge-check"></i> Verified Guide</span>' : ''}
          <h3>${g.name}</h3>
          <div class="guide-meta">${g.region} • ${g.experience} experience</div>
          <div class="guide-tags">
            ${g.languages.map(l => `<span class="guide-tag">${l}</span>`).join('')}
          </div>
          <div class="guide-rating"><i data-lucide="star"></i> ${g.rating} / 5.0</div>
        </div>
      </div>
    `).join('')
  } else if (tab === 'homestays') {
    content.innerHTML = marketplaceData.homestays.map(h => `
      <div class="homestay-card reveal">
        <img src="${h.image}" alt="${h.name}" loading="lazy" />
        <div class="homestay-body">
          ${h.verified ? '<span class="verified-badge"><i data-lucide="badge-check"></i> Verified Stay</span>' : ''}
          <h3>${h.name}</h3>
          <div class="guide-meta">Hosted by ${h.host} • ${h.village}</div>
          <div class="homestay-amenities">
            ${h.amenities.map(a => `<span class="amenity-tag">${a}</span>`).join('')}
          </div>
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <span class="homestay-price">${h.price}</span>
            <span class="guide-rating"><i data-lucide="star"></i> ${h.rating}</span>
          </div>
        </div>
      </div>
    `).join('')
  }

  lucide.createIcons()
}

// ---- Destination Modal ----
function openDestModal(dest) {
  const modal = document.getElementById('modal')
  const content = document.getElementById('modalContent')
  content.innerHTML = `
    <img src="${dest.image}" alt="${dest.name}" class="modal-image" />
    <div class="modal-category">${dest.category} • ${dest.type}</div>
    <h2 class="modal-title">${dest.name}</h2>
    <p class="modal-body">${dest.longDesc}</p>
    <div class="modal-section">
      <h4>Nearby Attractions</h4>
      <div class="modal-nearby">
        ${dest.nearby.map(n => `<span class="nearby-item"><i data-lucide="map-pin"></i> ${n}</span>`).join('')}
      </div>
    </div>
    <div class="modal-section">
      <h4>Tags</h4>
      <div class="modal-tags">
        ${dest.tags.map(t => `<span class="modal-tag">${t}</span>`).join('')}
      </div>
    </div>
  `
  modal.classList.add('active')
  lucide.createIcons()
}

// ---- Eco Score ----
function initEcoScore() {
  const targetScore = 78
  const ring = document.getElementById('ecoRingFill')
  const numEl = document.getElementById('ecoScoreNum')
  const circumference = 534
  const offset = circumference - (circumference * targetScore) / 100

  const ecoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        ring.style.transition = 'stroke-dashoffset 2s cubic-bezier(0.4,0,0.2,1)'
        ring.style.strokeDashoffset = offset

        let current = 0
        const increment = targetScore / 60
        const timer = setInterval(() => {
          current += increment
          if (current >= targetScore) {
            current = targetScore
            clearInterval(timer)
          }
          numEl.textContent = Math.round(current)
        }, 30)

        ecoObserver.disconnect()
      }
    })
  }, { threshold: 0.3 })

  ecoObserver.observe(document.querySelector('.eco-score-card'))

  // Badges
  const badges = [
    { icon: 'leaf', label: 'Eco Traveler' },
    { icon: 'heart', label: 'Community Supporter' },
    { icon: 'award', label: 'Culture Explorer' },
  ]
  document.getElementById('ecoBadges').innerHTML = badges.map(b =>
    `<span class="eco-badge"><i data-lucide="${b.icon}"></i> ${b.label}</span>`
  ).join('')

  // Charts
  setTimeout(() => {
    if (typeof Chart !== 'undefined') {
      const ctx1 = document.getElementById('impactChart').getContext('2d')
      impactChart = new Chart(ctx1, {
        type: 'doughnut',
        data: {
          labels: ['Local Economy', 'Nature Conservation', 'Cultural Preservation', 'Carbon Offset'],
          datasets: [{
            data: [35, 25, 25, 15],
            backgroundColor: ['#2d6a4f', '#f59e0b', '#c25e3f', '#6ee7b7'],
            borderWidth: 0,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: { font: { size: 10 }, color: '#5a6b5e', padding: 8 },
            },
          },
        },
      })

      const ctx2 = document.getElementById('communityChart').getContext('2d')
      communityChart = new Chart(ctx2, {
        type: 'bar',
        data: {
          labels: ['Artisans', 'Guides', 'Homestays', 'Farmers', 'Performers'],
          datasets: [{
            label: 'Income Boost (%)',
            data: [42, 35, 55, 28, 31],
            backgroundColor: '#2d6a4f',
            borderRadius: 6,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
          },
          scales: {
            y: { beginAtZero: true, ticks: { font: { size: 10 }, color: '#8a9a8e' } },
            x: { ticks: { font: { size: 10 }, color: '#5a6b5e' } },
          },
        },
      })
    }
  }, 200)
}

// ---- Assistant ----
function initAssistant() {
  const chat = document.getElementById('assistantChat')
  const input = document.getElementById('assistantInput')
  const send = document.getElementById('assistantSend')
  const quick = document.getElementById('assistantQuick')

  // Quick question buttons
  quick.innerHTML = faqData.slice(0, 4).map((f, i) =>
    `<button class="quick-btn" data-q="${i}">${f.q}</button>`
  ).join('')

  quick.querySelectorAll('.quick-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.q)
      askQuestion(faqData[idx].q)
    })
  })

  const askQuestion = (question) => {
    // Add user message
    const userMsg = document.createElement('div')
    userMsg.className = 'chat-msg user'
    userMsg.innerHTML = `<div class="chat-bubble">${escapeHtml(question)}</div>`
    chat.appendChild(userMsg)
    chat.scrollTop = chat.scrollHeight

    // Find answer
    const faq = faqData.find(f =>
      question.toLowerCase().includes(f.q.toLowerCase().split(' ')[0]) ||
      f.q.toLowerCase().includes(question.toLowerCase().slice(0, 10))
    ) || faqData.find(f =>
      f.q.toLowerCase().split(' ').some(word => word.length > 4 && question.toLowerCase().includes(word))
    )

    const answer = faq ? faq.a : "I'm not sure about that yet, but you can explore the Destinations, Culture Hub, and Trip Planner sections to learn more. Try asking about what JoharYatra is, the best time to visit, or how the trip planner works!"

    // Simulate typing delay
    setTimeout(() => {
      const botMsg = document.createElement('div')
      botMsg.className = 'chat-msg bot'
      botMsg.innerHTML = `
        <div class="chat-avatar"><i data-lucide="leaf"></i></div>
        <div class="chat-bubble">${answer}</div>
      `
      chat.appendChild(botMsg)
      lucide.createIcons()
      chat.scrollTop = chat.scrollHeight
    }, 600)
  }

  const handleSend = () => {
    const q = input.value.trim()
    if (!q) return
    askQuestion(q)
    input.value = ''
  }

  send.addEventListener('click', handleSend)
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleSend()
  })
}

function escapeHtml(text) {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

// ---- Navbar ----
function initNavbar() {
  const navbar = document.getElementById('navbar')
  const toggle = document.getElementById('navToggle')
  const links = document.getElementById('navLinks')

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled')
    } else {
      navbar.classList.remove('scrolled')
    }
  })

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active')
    links.classList.toggle('active')
  })

  links.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active')
      links.classList.remove('active')
    })
  })
}

// ---- Reveal on scroll ----
function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible')
        observer.unobserve(entry.target)
      }
    })
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' })

  const observeReveals = () => {
    document.querySelectorAll('.reveal:not(.visible)').forEach(el => observer.observe(el))
  }
  observeReveals()
  // Re-observe after dynamic content renders
  setTimeout(observeReveals, 200)
  setTimeout(observeReveals, 500)
}

// ---- Tabs ----
function initTabs() {
  document.querySelectorAll('.culture-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.culture-tab').forEach(t => t.classList.remove('active'))
      tab.classList.add('active')
      renderCultureTab(tab.dataset.tab)
    })
  })

  document.querySelectorAll('.market-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.market-tab').forEach(t => t.classList.remove('active'))
      tab.classList.add('active')
      renderMarketTab(tab.dataset.mtab)
    })
  })
}

// ---- Modal ----
function initModal() {
  const modal = document.getElementById('modal')
  const close = document.getElementById('modalClose')

  close.addEventListener('click', () => modal.classList.remove('active'))
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('active')
  })
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') modal.classList.remove('active')
  })

  // Destination cards open modal on double-click / via a detail button
  document.addEventListener('click', (e) => {
    const card = e.target.closest('.dest-card')
    if (card) {
      // Single click selects on map; let's also allow opening detail via the image
      const id = parseInt(card.dataset.id)
      const dest = destinationsData.find(d => d.id === id)
      if (e.target.tagName === 'IMG' || e.target.closest('.dest-card-body h3')) {
        openDestModal(dest)
      }
    }
  })
}

// ---- Init everything ----
async function init() {
  await loadData()

  renderWhyCards()
  renderJourney()
  renderFeatures()
  renderDestinations()
  renderUnique()
  renderTech()
  renderWin()
  renderFuture()
  renderTaglines()
  renderPlanner()
  renderCulture()
  renderMarketplace()

  initMap()
  initEcoScore()
  initAssistant()
  initNavbar()
  initTabs()
  initModal()
  initReveal()

  // Initialize icons after all content is rendered
  lucide.createIcons()

  // Re-init reveal for dynamically added elements
  setTimeout(() => initReveal(), 300)
}

init()
