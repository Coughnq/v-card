// Modal functions
function showModal(type) {
    const modal = document.getElementById(`${type}Modal`);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Add escape key listener
        document.addEventListener('keydown', function closeOnEscape(e) {
            if (e.key === 'Escape') {
                hideModal(type);
                document.removeEventListener('keydown', closeOnEscape);
            }
        });
        
        // Add click outside listener
        modal.addEventListener('click', function closeOnClickOutside(e) {
            if (e.target === modal) {
                hideModal(type);
                modal.removeEventListener('click', closeOnClickOutside);
            }
        });
    }
}

function hideModal(type) {
    const modal = document.getElementById(`${type}Modal`);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Display contact info
function displayContactInfo(contactInfo) {
    const contactDiv = document.getElementById('contact-info');
    if (!contactDiv) return;

    // Set profile photo if provided
    const profilePhoto = document.getElementById('profilePhoto');
    if (profilePhoto) {
        if (contactInfo.photo) {
            profilePhoto.src = contactInfo.photo;
        } else {
            profilePhoto.src = '';
            // Add default icon if no photo
            const defaultIcon = document.createElement('i');
            defaultIcon.className = 'fas fa-user';
            profilePhoto.parentElement.appendChild(defaultIcon);
        }
    }

    // Apply theme to container
    const container = document.querySelector('.contact-card');
    if (container) {
        container.className = `contact-card theme-${contactInfo.theme || 'default'}`;
        if (contactInfo.customColor) {
            container.style.setProperty('--card-accent', contactInfo.customColor);
        }
    }

    // Helper function to truncate and format long text
    const formatLongText = (text, maxLength = 150) => {
        if (text.length <= maxLength) return text;
        return `<div class="text-container" onclick="this.classList.toggle('expanded')">${text}</div>`;
    };

    contactDiv.innerHTML = `
        <h2>${contactInfo.name || ''}</h2>
        ${contactInfo.title ? `<p class="title">${contactInfo.title}</p>` : ''}
        ${contactInfo.company ? `<p class="company">${contactInfo.company}</p>` : ''}
        
        <div class="contact-details">
            ${contactInfo.phone ? `
                <div class="contact-item">
                    <i class="fas fa-phone"></i>
                    <a href="tel:${contactInfo.phone}">${contactInfo.phone}</a>
                </div>
            ` : ''}
            
            ${contactInfo.email ? `
                <div class="contact-item">
                    <i class="fas fa-envelope"></i>
                    <a href="mailto:${contactInfo.email}">${contactInfo.email}</a>
                </div>
            ` : ''}
            
            ${contactInfo.website ? `
                <div class="contact-item">
                    <i class="fas fa-globe"></i>
                    <a href="${contactInfo.website.startsWith('http') ? contactInfo.website : 'https://' + contactInfo.website}" 
                       target="_blank">${contactInfo.website}</a>
                </div>
            ` : ''}
            
            ${contactInfo.address ? `
                <div class="contact-item">
                    <i class="fas fa-map-marker-alt"></i>
                    <a href="https://maps.google.com/?q=${encodeURIComponent(contactInfo.address)}" 
                       target="_blank">${contactInfo.address}</a>
                </div>
            ` : ''}
        </div>
        
        ${contactInfo.notes ? `
            <div class="notes">
                <i class="fas fa-sticky-note"></i>
                <p>${formatLongText(contactInfo.notes)}</p>
            </div>
        ` : ''}
    `;

    // Add click handlers for expandable text
    document.querySelectorAll('.text-container').forEach(container => {
        if (container.scrollHeight > container.clientHeight) {
            container.classList.add('has-more');
        }
    });
}

// Show demo page
function showDemoPage() {
    const container = document.querySelector('.container');
    container.innerHTML = `
        <div class="demo-page">
            <div class="demo-header">
                <h1>Welcome to VizitQR™!</h1>
                <p class="subtitle">This page requires a VizitQR code to display contact information.</p>
            </div>

            <div class="demo-steps">
                <h2>How It Works</h2>
                <div class="steps">
                    <div class="step">
                        <div class="step-icon">
                            <img src="@IMG_0734.jpg" style="width: 100%; height: 100%; object-fit: cover;">
                        </div>
                        <p>Scan a VizitQR code</p>
                    </div>
                    <div class="step-arrow">
                        <i class="fas fa-arrow-right"></i>
                    </div>
                    <div class="step">
                        <div class="step-icon">
                            <i class="fas fa-address-card"></i>
                        </div>
                        <p>View contact details</p>
                    </div>
                    <div class="step-arrow">
                        <i class="fas fa-arrow-right"></i>
                    </div>
                    <div class="step">
                        <div class="step-icon">
                            <i class="fas fa-user-plus"></i>
                        </div>
                        <p>Save to contacts</p>
                    </div>
                </div>
            </div>

            <div class="demo-card">
                <h3>Example Contact Card</h3>
                <div class="contact-card">
                    <div class="profile-section">
                        <img src="@IMG_0734.jpg" class="profile-photo">
                        <div class="contact-info">
                            <div class="header-info">
                                <h2>Abner S.C</h2>
                                <p class="title">Founder & CEO</p>
                                <p class="company">Intelliquinte LLC</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Process contact parameters
function processContactInfo(params) {
    const contactInfo = {};
    
    // Decode basic info
    if (params.has('n')) contactInfo.name = atob(params.get('n'));
    if (params.has('p')) contactInfo.phone = atob(params.get('p'));
    if (params.has('e')) contactInfo.email = atob(params.get('e'));
    if (params.has('c')) contactInfo.company = atob(params.get('c'));
    if (params.has('t')) contactInfo.title = atob(params.get('t'));
    if (params.has('w')) contactInfo.website = atob(params.get('w'));
    if (params.has('a')) contactInfo.address = atob(params.get('a'));
    if (params.has('m')) contactInfo.notes = atob(params.get('m'));
    if (params.has('ph')) contactInfo.photo = atob(params.get('ph'));
    
    // Handle theme
    if (params.has('th')) contactInfo.theme = atob(params.get('th'));
    if (params.has('cc')) contactInfo.customColor = `#${atob(params.get('cc'))}`;
    
    displayContactInfo(contactInfo);
}

// Main initialization
document.addEventListener('DOMContentLoaded', () => {
    // Handle browser navigation
    window.addEventListener('popstate', () => {
        showDemoPage();
    });

    // Get URL parameters
    const params = new URLSearchParams(window.location.search);
    
    if (params.toString()) {
        // Store parameters temporarily
        const parameters = new URLSearchParams(params.toString());
        
        // Clear URL without triggering refresh
        window.history.replaceState({}, document.title, window.location.pathname);
        
        // Process the stored parameters
        processContactInfo(parameters);
    } else {
        showDemoPage();
    }
});

// Handle page visibility
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
        window.history.replaceState({}, document.title, window.location.pathname);
        showDemoPage();
    }
});

// Add decompression function
function decodeData(compressed) {
    try {
        const jsonString = LZString.decompressFromBase64(compressed);
        const data = JSON.parse(jsonString);
        
        return {
            name: data.n || '',
            phone: data.p || '',
            email: data.e || '',
            company: data.c || '',
            title: data.t || '',
            website: data.w || '',
            address: data.a || '',
            notes: data.m || '',
            // Only keep theme-related data
            theme: data.th || 'default',
            customColor: data.cc ? `#${data.cc}` : null
        };
    } catch (error) {
        console.error('Decoding error:', error);
        return null;
    }
}

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js', {
        scope: './'
    }).catch(error => {
        console.error('Service Worker registration failed:', error);
    });
}
 