class URLParser {
    static getParameters() {
        const params = new URLSearchParams(window.location.search);
        const vCardData = {};
        
        // Extract all parameters
        for (const [key, value] of params.entries()) {
            vCardData[key] = decodeURIComponent(value);
        }
        
        // Update meta tags for sharing
        if (vCardData.name) {
            document.title = `${vCardData.name} - Digital Business Card`;
            document.querySelector('meta[property="og:title"]').setAttribute('content', `${vCardData.name} - Digital Business Card`);
            document.querySelector('meta[property="og:description"]').setAttribute('content', 
                `View ${vCardData.name}'s digital business card${vCardData.title ? ` - ${vCardData.title}` : ''}`);
            document.querySelector('meta[property="og:url"]').setAttribute('content', window.location.href);
        }
        
        return vCardData;
    }
} 