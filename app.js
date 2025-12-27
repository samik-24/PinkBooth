/**
 * PINKCAM STUDIO - CORE ENGINE
 * Developer: Samik Nepal
 */

const PinkCam = {
    settings: {
        activeFilter: 'none',
        photoCount: 0,
        flashEnabled: true
    },

    elements: {
        video: document.getElementById('video'),
        canvas: document.getElementById('canvas'),
        shutter: document.getElementById('shutter'),
        filterGrid: document.getElementById('filter-grid'),
        gallery: document.getElementById('gallery'),
        counter: document.getElementById('photo-count'),
        flash: document.getElementById('flash')
    },

    init() {
        this.bindEvents();
        this.startCamera();
        this.generateFilterLibrary(120); // Create 120 unique filters
    },

    bindEvents() {
        this.elements.shutter.addEventListener('click', () => this.capture());
    },

    async startCamera() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { width: 1280, height: 720, facingMode: "user" } 
            });
            this.elements.video.srcObject = stream;
        } catch (err) {
            console.error("Camera Error: ", err);
            alert("Studio requires camera access to function.");
        }
    },

    generateFilterLibrary(count) {
        // Base Presets
        this.addFilterUI("Original", "none");
        this.addFilterUI("Cyberpink", "hue-rotate(300deg) saturate(200%) brightness(1.1)");
        this.addFilterUI("Y2K Gloss", "contrast(1.2) brightness(1.2) saturate(0.8) sepia(0.2)");

        // Dynamic Engine for 100+ Variations
        for (let i = 1; i <= count; i++) {
            const hue = i * 13.7; // Golden angle for color distribution
            const sat = 100 + (i % 5) * 40;
            const con = 90 + (i % 3) * 20;
            const filter = `hue-rotate(${hue}deg) saturate(${sat}%) contrast(${con}%)`;
            this.addFilterUI(`Preset #${1000 + i}`, filter);
        }
    },

    addFilterUI(name, filterValue) {
        const card = document.createElement('div');
        card.className = "flex-shrink-0 cursor-pointer transition-all duration-300 group";
        card.innerHTML = `
            <div class="w-20 h-24 rounded-2xl border-2 border-transparent group-hover:border-pink-400 overflow-hidden shadow-sm bg-slate-100" style="filter: ${filterValue}">
                <div class="w-full h-full bg-pink-200 flex items-center justify-center text-white">
                    <i class="fas fa-magic opacity-40"></i>
                </div>
            </div>
            <p class="text-[10px] text-center font-bold text-slate-400 mt-2 uppercase truncate w-20 group-hover:text-pink-500">${name}</p>
        `;
        card.onclick = () => {
            this.elements.video.style.filter = filterValue;
            this.settings.activeFilter = filterValue;
        };
        this.elements.filterGrid.appendChild(card);
    },

    capture() {
        // Shutter Sound & Flash Effect
        this.elements.flash.classList.replace('opacity-0', 'opacity-100');
        setTimeout(() => this.elements.flash.classList.replace('opacity-100', 'opacity-0'), 100);

        const ctx = this.elements.canvas.getContext('2d');
        this.elements.canvas.width = this.elements.video.videoWidth;
        this.elements.canvas.height = this.elements.video.videoHeight;

        // Apply processing
        ctx.filter = this.settings.activeFilter;
        ctx.translate(this.elements.canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(this.elements.video, 0, 0);

        const imgData = this.elements.canvas.toDataURL('image/jpeg', 0.9);
        this.addToGallery(imgData);
        
        // Update Session State
        this.settings.photoCount++;
        this.elements.counter.innerText = this.settings.photoCount;
    },

    addToGallery(src) {
        const item = document.createElement('div');
        item.className = "relative rounded-xl overflow-hidden shadow-lg border-2 border-white group animate-in fade-in zoom-in duration-500";
        item.innerHTML = `
            <img src="${src}" class="w-full aspect-square object-cover">
            <div class="absolute inset-0 bg-pink-600/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                <a href="${src}" download="pinkcam_${Date.now()}.jpg" class="bg-white text-pink-600 p-2 rounded-full shadow-lg">
                    <i class="fas fa-download"></i>
                </a>
            </div>
        `;
        this.elements.gallery.prepend(item);
    }
};

// Initialize Application
document.addEventListener('DOMContentLoaded', () => PinkCam.init());
