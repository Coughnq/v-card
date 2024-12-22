class VCardViewer {
    constructor() {
        this.initializeElements();
        this.attachEventListeners();
        this.loadCard();
        this.loadTheme();
    }

    initializeElements() {
        this.vCardContainer = document.getElementById('vCardContainer');
        this.downloadVCardBtn = document.getElementById('downloadVCard');
        this.copyUrlBtn = document.getElementById('copyUrl');
        this.themeToggleBtn = document.getElementById('themeToggle');
    }

    attachEventListeners() {
        this.downloadVCardBtn.addEventListener('click', () => this.downloadVCard());
        this.copyUrlBtn.addEventListener('click', () => this.copyCurrentUrl());
        this.themeToggleBtn.addEventListener('click', () => this.toggleTheme());
    }

    loadCard() {
        const vCardData = URLParser.getParameters();
        
        if (Object.keys(vCardData).length === 0) {
            this.showError('No contact information provided');
            return;
        }

        this.displayCard(vCardData);
    }

    displayCard(data) {
        // Set theme color if provided
        if (data.themeColor) {
            const themeLight = this.calculateLighterShade(data.themeColor);
            document.documentElement.style.setProperty('--theme-color', data.themeColor);
            document.documentElement.style.setProperty('--theme-light', themeLight);
        }

        this.vCardContainer.innerHTML = this.createCardHTML(data);
    }

    createCardHTML(data) {
        return `
            <div class="vcard">
                <div class="vcard-header">
                    <div class="avatar">${this.getInitials(data.name)}</div>
                    <div class="header-content">
                        <h2>${data.name}</h2>
                        ${data.title ? `<p class="title">${data.title}</p>` : ''}
                    </div>
                </div>
                <div class="vcard-content">
                    ${data.email ? `
                        <div class="contact-item">
                            <div class="icon">📧</div>
                            <div class="details">
                                <label>Email</label>
                                <a href="mailto:${data.email}">${data.email}</a>
                            </div>
                        </div>
                    ` : ''}
                    ${data.phone ? `
                        <div class="contact-item">
                            <div class="icon">📱</div>
                            <div class="details">
                                <label>Phone</label>
                                <a href="tel:${data.phone}">${data.phone}</a>
                            </div>
                        </div>
                    ` : ''}
                    ${data.website ? `
                        <div class="contact-item">
                            <div class="icon">🌐</div>
                            <div class="details">
                                <label>Website</label>
                                <a href="${data.website}" target="_blank">${data.website}</a>
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    downloadVCard() {
        const vCardData = URLParser.getParameters();
        const vCardString = this.createVCardString(vCardData);
        
        const blob = new Blob([vCardString], { type: 'text/vcard' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        
        link.href = url;
        link.download = 'contact.vcf';
        link.click();
        
        window.URL.revokeObjectURL(url);
    }

    createVCardString(data) {
        const vCard = [
            'BEGIN:VCARD',
            'VERSION:3.0',
            `FN:${data.name || ''}`,
            `TITLE:${data.title || ''}`,
            `EMAIL:${data.email || ''}`,
            `TEL:${data.phone || ''}`,
            `URL:${data.website || ''}`,
            'END:VCARD'
        ].join('\n');

        return vCard;
    }

    async copyCurrentUrl() {
        try {
            await navigator.clipboard.writeText(window.location.href);
            this.copyUrlBtn.textContent = 'Copied!';
            setTimeout(() => {
                this.copyUrlBtn.innerHTML = '<span class="icon">📋</span><span>Copy Link</span>';
            }, 2000);
        } catch (err) {
            console.error('Failed to copy URL:', err);
        }
    }

    toggleTheme() {
        const isDark = document.body.getAttribute('data-theme') === 'dark';
        document.body.setAttribute('data-theme', isDark ? 'light' : 'dark');
        localStorage.setItem('theme', isDark ? 'light' : 'dark');
    }

    loadTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.body.setAttribute('data-theme', savedTheme);
    }

    getInitials(name) {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    }

    calculateLighterShade(hex) {
        let r = parseInt(hex.slice(1, 3), 16);
        let g = parseInt(hex.slice(3, 5), 16);
        let b = parseInt(hex.slice(5, 7), 16);

        r = Math.min(255, r + 50);
        g = Math.min(255, g + 50);
        b = Math.min(255, b + 50);

        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }

    showError(message) {
        this.vCardContainer.innerHTML = `
            <div class="error-message">
                <p>⚠️ ${message}</p>
                <a href="https://vizitqr.intelliquinte.com" class="action-button">Create a Card</a>
            </div>
        `;
    }
}

// Initialize the viewer when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new VCardViewer();
}); 