let map;
let currentTheme = 'light';

// Start Exploration
function startExploration() {
    document.getElementById('landingPage').style.display = 'none';
    document.getElementById('mainApp').classList.add('active');
    
    // Fetch weather data
    fetchWeatherData();
    
    // Fetch news
    fetchBeritaFromAPI();
    
    // Initialize map after a short delay
    setTimeout(() => {
        initMap();
    }, 300);
}

// Toggle Theme
function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.body.classList.toggle('dark-theme');
    
    const icon = document.getElementById('themeIcon');
    icon.className = currentTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
}

// Smooth Scrolling
document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            link.classList.add('active');
            
            // Smooth scroll to section
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Intersection Observer for active nav - track main sections
    const sections = document.querySelectorAll('section[id]');
    const observerOptions = {
        threshold: 0.3
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
});

// Auto-update weather every 10 minutes
setInterval(fetchWeatherData, 600000);

// Tab Switching
function switchTab(tabName) {
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        content.classList.remove('active');
    });

    // Remove active class from all buttons
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected tab content
    const selectedTab = document.getElementById(tabName);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }

    // Add active class to clicked button
    event.target.closest('.tab-btn').classList.add('active');
}

// Fetch Weather Data
function fetchWeatherData() {
    // Bandung coordinates: -6.9175, 107.6191 -6.861139113118697, 107.5920539064732
    const latitude = -6.861139113118697;
    const longitude = 107.5920539064732;
    
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m,pressure_msl,visibility,uv_index,precipitation&daily=sunrise,sunset&timezone=Asia/Jakarta`;
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            updateWeatherDisplay(data);
        })
        .catch(error => {
            console.log('Error fetching weather:', error);
            document.getElementById('cuacaUpdate').textContent = 'Gagal memuat data cuaca';
        });
}

// Update Weather Display
function updateWeatherDisplay(data) {
    const current = data.current;
    const daily = data.daily;
    
    // Weather Code to Description & Icon
    const weatherDescriptions = {
        0: { desc: 'Cerah', icon: 'fas fa-sun' },
        1: { desc: 'Sebagian Berawan', icon: 'fas fa-cloud-sun' },
        2: { desc: 'Mendung', icon: 'fas fa-cloud' },
        3: { desc: 'Berawan', icon: 'fas fa-cloud' },
        45: { desc: 'Kabut', icon: 'fas fa-cloud' },
        48: { desc: 'Kabut Beku', icon: 'fas fa-cloud' },
        51: { desc: 'Hujan Ringan', icon: 'fas fa-cloud-rain' },
        53: { desc: 'Hujan Sedang', icon: 'fas fa-cloud-rain' },
        55: { desc: 'Hujan Deras', icon: 'fas fa-cloud-rain' },
        61: { desc: 'Hujan Ringan', icon: 'fas fa-cloud-rain' },
        63: { desc: 'Hujan Sedang', icon: 'fas fa-cloud-rain' },
        65: { desc: 'Hujan Deras', icon: 'fas fa-cloud-rain' },
        71: { desc: 'Salju Ringan', icon: 'fas fa-snowflake' },
        73: { desc: 'Salju Sedang', icon: 'fas fa-snowflake' },
        75: { desc: 'Salju Deras', icon: 'fas fa-snowflake' },
        77: { desc: 'Butir Salju', icon: 'fas fa-snowflake' },
        80: { desc: 'Hujan Ringan', icon: 'fas fa-cloud-rain' },
        81: { desc: 'Hujan Sedang', icon: 'fas fa-cloud-rain' },
        82: { desc: 'Hujan Deras', icon: 'fas fa-cloud-rain' },
        85: { desc: 'Salju Ringan', icon: 'fas fa-snowflake' },
        86: { desc: 'Salju Deras', icon: 'fas fa-snowflake' },
        95: { desc: 'Badai', icon: 'fas fa-bolt' },
        96: { desc: 'Badai dengan Hujan Es', icon: 'fas fa-bolt' },
        99: { desc: 'Badai dengan Hujan Es Deras', icon: 'fas fa-bolt' }
    };
    
    const weather = weatherDescriptions[current.weather_code] || { desc: 'Tidak Diketahui', icon: 'fas fa-question' };
    
    // Update main values
    document.getElementById('tempValue').textContent = Math.round(current.temperature_2m);
    document.getElementById('feelsLike').textContent = Math.round(current.apparent_temperature) + '°C';
    document.getElementById('humidity').textContent = current.relative_humidity_2m + '%';
    document.getElementById('windSpeed').textContent = Math.round(current.wind_speed_10m) + ' km/h';
    document.getElementById('pressure').textContent = current.pressure_msl + ' mb';
    document.getElementById('visibility').textContent = (current.visibility / 1000).toFixed(1) + ' km';
    document.getElementById('uvIndex').textContent = current.uv_index.toFixed(1);
    document.getElementById('rainfall').textContent = current.precipitation + ' mm';
    document.getElementById('cuacaDesc').textContent = weather.desc;
    
    // Update icon
    const iconElement = document.getElementById('cuacaIcon');
    iconElement.className = weather.icon;
    
    // Update sunrise & sunset
    const sunrise = new Date(daily.sunrise[0]);
    const sunset = new Date(daily.sunset[0]);
    document.getElementById('sunrise').textContent = sunrise.getHours().toString().padStart(2, '0') + ':' + sunrise.getMinutes().toString().padStart(2, '0');
    document.getElementById('sunset').textContent = sunset.getHours().toString().padStart(2, '0') + ':' + sunset.getMinutes().toString().padStart(2, '0');
    
    // Update timestamp
    document.getElementById('cuacaUpdate').textContent = 'Diperbarui: ' + new Date().toLocaleTimeString('id-ID');
}

// Fetch Berita from NewsAPI
function fetchBeritaFromAPI() {
    const beritaGrid = document.getElementById('beritaGrid');
    const beritaLoading = document.getElementById('beritaLoading');
    const beritaError = document.getElementById('beritaError');
    
    // Menggunakan NewsAPI (free tier)
    const apiKey = '7db5b0ec2ddc4e7c9f1a3a2c5a0b9e1d'; // Demo key (ganti dengan key Anda sendiri dari newsapi.org)
    const url = `https://newsapi.org/v2/everything?q=bandung&sortBy=publishedAt&language=id&pageSize=8&apiKey=${apiKey}`;
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            beritaLoading.style.display = 'none';
            
            if (data.articles && data.articles.length > 0) {
                beritaGrid.innerHTML = '';
                
                data.articles.forEach(article => {
                    const publishDate = new Date(article.publishedAt);
                    const formattedDate = publishDate.toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                    });
                    
                    const beritaCard = document.createElement('div');
                    beritaCard.className = 'berita-card';
                    beritaCard.innerHTML = `
                        <div class="berita-image">
                            <img src="${article.urlToImage || 'https://images.unsplash.com/photo-1633356713097-6b730901aaf0?w=400&h=200&fit=crop'}" alt="${article.title}" onerror="this.src='https://images.unsplash.com/photo-1633356713097-6b730901aaf0?w=400&h=200&fit=crop'">
                        </div>
                        <div class="berita-content">
                            <span class="berita-kategori">${article.source.name}</span>
                            <h3>${article.title}</h3>
                            <p>${article.description || 'Berita terbaru dari ' + article.source.name}</p>
                            <div class="berita-meta">
                                <span><i class="fas fa-calendar"></i> ${formattedDate}</span>
                            </div>
                            <a href="${article.url}" target="_blank" class="berita-link">Baca Selengkapnya</a>
                        </div>
                    `;
                    
                    beritaGrid.appendChild(beritaCard);
                });
            } else {
                beritaError.style.display = 'flex';
            }
        })
        .catch(error => {
            console.log('Error fetching news:', error);
            beritaLoading.style.display = 'none';
            beritaError.style.display = 'flex';
        });
}
