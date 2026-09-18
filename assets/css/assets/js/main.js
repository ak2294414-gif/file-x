// Aura Tech Main JavaScript Logic

document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // 2. ROI Calculator Logic (Home Page)
    const chatSlider = document.getElementById('chat-slider');
    const chatCountLabel = document.getElementById('chat-count-label');
    const hoursSaved = document.getElementById('hours-saved');
    const rupeeSaved = document.getElementById('rupee-saved');

    if (chatSlider) {
        chatSlider.addEventListener('input', (e) => {
            const val = parseInt(e.target.value);
            chatCountLabel.textContent = `${val} chats/day`;
            const estHours = Math.round(val * 0.72);
            const estRupees = Math.round(val * 180);
            hoursSaved.textContent = `${estHours} Hours`;
            rupeeSaved.textContent = `₹${estRupees.toLocaleString('en-IN')}+`;
        });
    }

    // 3. Service Page Vertical Toggle
    window.switchVertical = function(vertical) {
        const btnAi = document.getElementById('btn-ai');
        const btnWeb = document.getElementById('btn-web');
        const verticalAi = document.getElementById('vertical-ai');
        const verticalWeb = document.getElementById('vertical-web');

        if (vertical === 'ai') {
            btnAi.className = "px-6 py-3 rounded-xl font-bold text-sm bg-blue-600 text-white shadow-lg shadow-blue-600/30 transition-all";
            btnWeb.className = "px-6 py-3 rounded-xl font-bold text-sm bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 transition-all";
            verticalAi.classList.remove('hidden');
            verticalWeb.classList.add('hidden');
        } else {
            btnWeb.className = "px-6 py-3 rounded-xl font-bold text-sm bg-blue-600 text-white shadow-lg shadow-blue-600/30 transition-all";
            btnAi.className = "px-6 py-3 rounded-xl font-bold text-sm bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 transition-all";
            verticalWeb.classList.remove('hidden');
            verticalAi.classList.add('hidden');
        }
    };

    // 4. Pre-fill Service from URL Query Parameter
    const urlParams = new URLSearchParams(window.location.search);
    const selectedServiceParam = urlParams.get('service');
    const serviceSelect = document.getElementById('service-select');
    if (selectedServiceParam && serviceSelect) {
        for (let option of serviceSelect.options) {
            if (option.value.toLowerCase().includes(selectedServiceParam.toLowerCase())) {
                option.selected = true;
                break;
            }
        }
    }

    // 5. Contact Form Submission & Firebase Realtime Database Sync
    const consultationForm = document.getElementById('consultation-form');
    const successBox = document.getElementById('success-box');
    const whatsappRedirectBtn = document.getElementById('whatsapp-redirect-btn');

    if (consultationForm) {
        consultationForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = document.getElementById('submit-btn');
            submitBtn.textContent = "Syncing with Firebase...";
            submitBtn.disabled = true;

            const clientData = {
                name: document.getElementById('client-name').value,
                company: document.getElementById('company-name').value,
                phone: document.getElementById('client-phone').value,
                service: serviceSelect.value,
                maintenance: document.getElementById('maintenance-select').value,
                details: document.getElementById('project-details').value,
                timestamp: new Date().toISOString()
            };

            const firebaseURL = `https://dxdd-c7fd7-default-rtdb.firebaseio.com/consultations.json`;

            try {
                await fetch(firebaseURL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(clientData)
                });
            } catch (err) {
                console.error("Firebase sync error:", err);
            }

            // Prepare WhatsApp redirection payload
            const waMessage = `Hello Aura Tech, my name is ${clientData.name} from ${clientData.company}. I am interested in ${clientData.service} with ${clientData.maintenance}. Project details: ${clientData.details}`;
            const encodedMessage = encodeURIComponent(waMessage);
            whatsappRedirectBtn.href = `https://wa.me/919864197899?text=${encodedMessage}`;

            // Show success confirmation
            consultationForm.classList.add('hidden');
            successBox.classList.remove('hidden');
        });
    }
});
