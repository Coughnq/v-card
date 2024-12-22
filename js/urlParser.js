class URLParser {
    static getParameters() {
        const params = new URLSearchParams(window.location.search);
        const vCardData = {};
        
        // Extract all parameters
        for (const [key, value] of params.entries()) {
            vCardData[key] = decodeURIComponent(value);
        }
        
        return vCardData;
    }
} 