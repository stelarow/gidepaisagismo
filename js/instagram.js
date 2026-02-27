/* ===================================
   GIDI Paisagismo - Instagram Feed
   =================================== */

document.addEventListener('DOMContentLoaded', function() {
    // Note: Instagram Basic Display API requires authentication
    // This is a simplified version with placeholder functionality
    // For production, you'll need to implement Instagram API integration

    initializeInstagramFeed();
});

/* ===================================
   Instagram Feed Initialization
   =================================== */
function initializeInstagramFeed() {
    const feedContainer = document.getElementById('instagram-feed');

    if (!feedContainer) return;

    // Option 1: Use Instagram API (requires access token)
    // loadInstagramAPI();

    // Option 2: Use Instagram embed widget
    // loadInstagramWidget();

    // Option 3: Static placeholder (current implementation)
    // The HTML already contains static posts, so we'll enhance them with animations
    enhanceInstagramFeed();
}

/* ===================================
   Enhance Instagram Feed (Static)
   =================================== */
function enhanceInstagramFeed() {
    const instagramItems = document.querySelectorAll('.instagram-item');

    instagramItems.forEach((item, index) => {
        // Add stagger animation
        item.style.animationDelay = `${index * 0.1}s`;

        // Add hover effect enhancement
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
        });

        item.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });

    // Lazy load Instagram images
    const instagramImages = document.querySelectorAll('.instagram-item img');

    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });

        instagramImages.forEach(img => imageObserver.observe(img));
    }
}

/* ===================================
   Load Instagram API (Production)
   =================================== */
async function loadInstagramAPI() {
    // Instagram Basic Display API Configuration
    const ACCESS_TOKEN = 'YOUR_INSTAGRAM_ACCESS_TOKEN'; // Replace with actual token
    const USER_ID = 'YOUR_INSTAGRAM_USER_ID'; // Replace with actual user ID
    const LIMIT = 8;

    const apiUrl = `https://graph.instagram.com/${USER_ID}/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp&access_token=${ACCESS_TOKEN}&limit=${LIMIT}`;

    try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error('Instagram API request failed');
        }

        const data = await response.json();

        if (data.data && data.data.length > 0) {
            renderInstagramPosts(data.data);
        } else {
            console.warn('No Instagram posts found');
        }
    } catch (error) {
        console.error('Error loading Instagram feed:', error);
        // Fallback to static content
    }
}

/* ===================================
   Render Instagram Posts
   =================================== */
function renderInstagramPosts(posts) {
    const feedContainer = document.getElementById('instagram-feed');

    if (!feedContainer) return;

    // Clear existing content
    feedContainer.innerHTML = '';

    posts.forEach((post, index) => {
        const postElement = createInstagramPostElement(post, index);
        feedContainer.appendChild(postElement);
    });
}

/* ===================================
   Create Instagram Post Element
   =================================== */
function createInstagramPostElement(post, index) {
    const item = document.createElement('div');
    item.className = 'instagram-item';
    item.setAttribute('data-aos', 'zoom-in');
    item.setAttribute('data-aos-delay', index * 50);

    const link = document.createElement('a');
    link.href = post.permalink;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';

    const img = document.createElement('img');
    img.src = post.media_type === 'VIDEO' ? post.thumbnail_url : post.media_url;
    img.alt = post.caption ? post.caption.substring(0, 100) : 'Instagram Post';
    img.loading = 'lazy';

    const overlay = document.createElement('div');
    overlay.className = 'instagram-overlay';

    const icon = document.createElement('i');
    icon.className = 'fab fa-instagram';

    const stats = document.createElement('div');
    stats.className = 'instagram-stats';

    // Note: Likes and comments require additional API permissions
    // Using placeholder values for demo
    stats.innerHTML = `
        <span><i class="fas fa-heart"></i> ${getRandomLikes()}</span>
        <span><i class="fas fa-comment"></i> ${getRandomComments()}</span>
    `;

    overlay.appendChild(icon);
    overlay.appendChild(stats);
    link.appendChild(img);
    link.appendChild(overlay);
    item.appendChild(link);

    return item;
}

/* ===================================
   Load Instagram Widget (Alternative)
   =================================== */
function loadInstagramWidget() {
    // Using third-party Instagram widget service
    // Example: Behold, SnapWidget, Taggbox, etc.

    const feedContainer = document.getElementById('instagram-feed');

    if (!feedContainer) return;

    // Example with SnapWidget (replace with actual widget code)
    const widgetScript = document.createElement('script');
    widgetScript.src = 'https://snapwidget.com/js/snapwidget.js';
    document.body.appendChild(widgetScript);

    // Widget iframe or embed code
    const widgetCode = `
        <!-- SnapWidget -->
        <iframe src="https://snapwidget.com/embed/WIDGET_ID"
                class="snapwidget-widget"
                allowtransparency="true"
                frameborder="0"
                scrolling="no"
                style="border:none; overflow:hidden; width:100%;">
        </iframe>
    `;

    // feedContainer.innerHTML = widgetCode;
}

/* ===================================
   Instagram Access Token Management
   =================================== */
class InstagramTokenManager {
    constructor() {
        this.accessToken = null;
        this.expiresAt = null;
    }

    async refreshToken(refreshToken) {
        const url = 'https://graph.instagram.com/refresh_access_token';
        const params = new URLSearchParams({
            grant_type: 'ig_refresh_token',
            access_token: refreshToken
        });

        try {
            const response = await fetch(`${url}?${params}`);
            const data = await response.json();

            if (data.access_token) {
                this.accessToken = data.access_token;
                this.expiresAt = Date.now() + (data.expires_in * 1000);
                this.saveToken();
                return true;
            }
        } catch (error) {
            console.error('Error refreshing Instagram token:', error);
            return false;
        }
    }

    saveToken() {
        localStorage.setItem('instagram_token', this.accessToken);
        localStorage.setItem('instagram_token_expires', this.expiresAt);
    }

    loadToken() {
        this.accessToken = localStorage.getItem('instagram_token');
        this.expiresAt = parseInt(localStorage.getItem('instagram_token_expires'));

        return this.accessToken && this.expiresAt > Date.now();
    }

    isTokenValid() {
        return this.accessToken && this.expiresAt && this.expiresAt > Date.now();
    }
}

/* ===================================
   Utility Functions
   =================================== */
function getRandomLikes() {
    return Math.floor(Math.random() * 300) + 100;
}

function getRandomComments() {
    return Math.floor(Math.random() * 20) + 5;
}

function formatInstagramDate(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000); // seconds

    if (diff < 60) return 'agora';
    if (diff < 3600) return `${Math.floor(diff / 60)} min`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} h`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} d`;

    return date.toLocaleDateString('pt-BR', {
        day: 'numeric',
        month: 'short'
    });
}

/* ===================================
   Instagram Feed Error Handling
   =================================== */
function handleInstagramError(error) {
    console.error('Instagram Feed Error:', error);

    const feedContainer = document.getElementById('instagram-feed');

    if (!feedContainer) return;

    // Show error message or fallback content
    const errorMessage = document.createElement('div');
    errorMessage.className = 'instagram-error';
    errorMessage.innerHTML = `
        <div style="text-align: center; padding: 2rem;">
            <i class="fab fa-instagram" style="font-size: 3rem; color: #E1306C; margin-bottom: 1rem;"></i>
            <p>Não foi possível carregar o feed do Instagram.</p>
            <a href="https://instagram.com/gidipaisagismo"
               target="_blank"
               rel="noopener noreferrer"
               class="btn-instagram">
                Visite nosso Instagram
            </a>
        </div>
    `;

    // Only show error if there's no static content
    if (feedContainer.children.length === 0) {
        feedContainer.appendChild(errorMessage);
    }
}

/* ===================================
   Manual Instagram Feed Update
   =================================== */
function manualUpdateInstagramFeed(posts) {
    // For manual updates without API
    // Posts format: Array of { image, link, likes, comments }

    const feedContainer = document.getElementById('instagram-feed');

    if (!feedContainer || !posts || posts.length === 0) return;

    feedContainer.innerHTML = '';

    posts.forEach((post, index) => {
        const item = document.createElement('div');
        item.className = 'instagram-item';

        item.innerHTML = `
            <a href="${post.link}" target="_blank" rel="noopener noreferrer">
                <img src="${post.image}" alt="Instagram Post ${index + 1}" loading="lazy">
                <div class="instagram-overlay">
                    <i class="fab fa-instagram"></i>
                    <div class="instagram-stats">
                        <span><i class="fas fa-heart"></i> ${post.likes || getRandomLikes()}</span>
                        <span><i class="fas fa-comment"></i> ${post.comments || getRandomComments()}</span>
                    </div>
                </div>
            </a>
        `;

        feedContainer.appendChild(item);
    });
}

/* ===================================
   Export Instagram Functions
   =================================== */
window.GIDIInstagram = {
    loadInstagramAPI,
    manualUpdateInstagramFeed,
    InstagramTokenManager,
    formatInstagramDate
};

/* ===================================
   Instructions for Production Setup
   =================================== */
/*
Para configurar o feed do Instagram em produção:

1. OPÇÃO A - Instagram Basic Display API:
   - Crie um aplicativo em https://developers.facebook.com
   - Configure Instagram Basic Display
   - Obtenha o Access Token e User ID
   - Substitua as variáveis ACCESS_TOKEN e USER_ID
   - Implemente refresh token para tokens de longa duração

2. OPÇÃO B - Widget de Terceiros:
   - Use serviços como SnapWidget, Behold, ou Taggbox
   - Copie o código embed fornecido
   - Substitua em loadInstagramWidget()

3. OPÇÃO C - Feed Estático (Atual):
   - Atualize manualmente as imagens em /images/instagram/
   - Use manualUpdateInstagramFeed() para atualizar via CMS

Recomendação: Para simplicidade, use a Opção B (Widget)
Para mais controle, use a Opção A (API)
*/

console.log('📸 Instagram Feed: Modo estático ativo. Configure a API para feed dinâmico.');
