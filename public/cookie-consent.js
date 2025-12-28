/**
 * MajestIQ Cookie Consent Banner
 * A self-contained, CCPA-compliant cookie consent solution
 *
 * @version 1.0.0
 * @license MIT
 */

(function() {
  'use strict';

  // Configuration
  const CONFIG = {
    cookieName: 'majestiq_consent',
    cookieExpiry: 365, // days
    privacyPolicyUrl: '/privacy-policy.html',
    defaultAnalytics: true // Analytics on by default, user can opt-out
  };

  // Consent state
  let consentState = null;
  let consentCallbacks = [];
  let analyticsCallbacks = [];

  // ============================================
  // COOKIE UTILITIES
  // ============================================

  function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = 'expires=' + date.toUTCString();
    document.cookie = name + '=' + encodeURIComponent(JSON.stringify(value)) + ';' + expires + ';path=/;SameSite=Lax';
  }

  function getCookie(name) {
    const nameEQ = name + '=';
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i].trim();
      if (cookie.indexOf(nameEQ) === 0) {
        try {
          return JSON.parse(decodeURIComponent(cookie.substring(nameEQ.length)));
        } catch (e) {
          return null;
        }
      }
    }
    return null;
  }

  // ============================================
  // CONSENT MANAGEMENT
  // ============================================

  function getStoredConsent() {
    return getCookie(CONFIG.cookieName);
  }

  function saveConsent(consent) {
    consentState = {
      essential: true, // Always true
      analytics: consent.analytics,
      timestamp: new Date().toISOString(),
      version: '1.0'
    };
    setCookie(CONFIG.cookieName, consentState, CONFIG.cookieExpiry);

    // Fire callbacks
    consentCallbacks.forEach(cb => cb(consentState));

    if (consentState.analytics) {
      analyticsCallbacks.forEach(cb => cb());
    }
  }

  function hasConsent() {
    return consentState !== null;
  }

  function hasAnalyticsConsent() {
    return consentState !== null && consentState.analytics === true;
  }

  // ============================================
  // STYLES INJECTION
  // ============================================

  function injectStyles() {
    const styles = `
      /* MajestIQ Cookie Consent Styles */
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500;600&display=swap');

      .mq-consent-overlay {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 99999;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        transform: translateY(100%);
        transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      }

      .mq-consent-overlay.mq-visible {
        transform: translateY(0);
      }

      .mq-consent-overlay.mq-hidden {
        display: none;
      }

      .mq-consent-banner {
        background: linear-gradient(to top, #0A0A0A 0%, #111111 100%);
        border-top: 1px solid rgba(255, 215, 0, 0.2);
        box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.5);
        padding: 24px;
      }

      .mq-consent-container {
        max-width: 1200px;
        margin: 0 auto;
      }

      .mq-consent-main {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 24px;
      }

      .mq-consent-content {
        flex: 1;
        min-width: 0;
      }

      .mq-consent-title {
        font-family: 'Space Grotesk', sans-serif;
        font-size: 18px;
        font-weight: 600;
        color: #FFFFFF;
        margin: 0 0 8px 0;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .mq-consent-title::before {
        content: '';
        display: inline-block;
        width: 8px;
        height: 8px;
        background: #FFD700;
        border-radius: 2px;
      }

      .mq-consent-text {
        font-size: 14px;
        line-height: 1.6;
        color: #A3A3A3;
        margin: 0;
      }

      .mq-consent-text a {
        color: #FFD700;
        text-decoration: none;
        transition: color 0.2s ease;
      }

      .mq-consent-text a:hover {
        color: #D4AF37;
        text-decoration: underline;
      }

      .mq-consent-actions {
        display: flex;
        align-items: center;
        gap: 12px;
        flex-shrink: 0;
      }

      .mq-consent-btn {
        font-family: 'Inter', sans-serif;
        font-size: 14px;
        font-weight: 600;
        padding: 12px 24px;
        border-radius: 6px;
        border: none;
        cursor: pointer;
        transition: all 0.2s ease;
        white-space: nowrap;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      .mq-consent-btn:focus {
        outline: 2px solid #FFD700;
        outline-offset: 2px;
      }

      .mq-consent-btn-accept {
        background: linear-gradient(135deg, #FFD700 0%, #D4AF37 100%);
        color: #0A0A0A;
      }

      .mq-consent-btn-accept:hover {
        background: linear-gradient(135deg, #FFE44D 0%, #E5C348 100%);
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(255, 215, 0, 0.3);
      }

      .mq-consent-btn-settings {
        background: transparent;
        color: #FFFFFF;
        border: 1px solid rgba(255, 255, 255, 0.3);
      }

      .mq-consent-btn-settings:hover {
        border-color: #FFD700;
        color: #FFD700;
      }

      .mq-consent-btn-reject {
        background: transparent;
        color: #A3A3A3;
        padding: 12px 16px;
      }

      .mq-consent-btn-reject:hover {
        color: #FFFFFF;
      }

      /* Settings Panel */
      .mq-consent-settings {
        display: none;
        margin-top: 24px;
        padding-top: 24px;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
      }

      .mq-consent-settings.mq-visible {
        display: block;
        animation: mq-slideDown 0.3s ease;
      }

      @keyframes mq-slideDown {
        from {
          opacity: 0;
          transform: translateY(-10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .mq-consent-settings-title {
        font-family: 'Space Grotesk', sans-serif;
        font-size: 16px;
        font-weight: 600;
        color: #FFFFFF;
        margin: 0 0 16px 0;
      }

      .mq-consent-toggle-group {
        display: flex;
        flex-direction: column;
        gap: 16px;
        margin-bottom: 20px;
      }

      .mq-consent-toggle-item {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 16px;
        padding: 16px;
        background: rgba(255, 255, 255, 0.03);
        border-radius: 8px;
        border: 1px solid rgba(255, 255, 255, 0.05);
      }

      .mq-consent-toggle-info {
        flex: 1;
      }

      .mq-consent-toggle-label {
        font-size: 14px;
        font-weight: 600;
        color: #FFFFFF;
        margin: 0 0 4px 0;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .mq-consent-toggle-badge {
        font-size: 10px;
        font-weight: 500;
        padding: 2px 6px;
        border-radius: 4px;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      .mq-consent-toggle-badge-required {
        background: rgba(255, 215, 0, 0.2);
        color: #FFD700;
      }

      .mq-consent-toggle-badge-optional {
        background: rgba(163, 163, 163, 0.2);
        color: #A3A3A3;
      }

      .mq-consent-toggle-desc {
        font-size: 13px;
        color: #A3A3A3;
        margin: 0;
        line-height: 1.5;
      }

      /* Toggle Switch */
      .mq-consent-switch {
        position: relative;
        width: 48px;
        height: 26px;
        flex-shrink: 0;
      }

      .mq-consent-switch input {
        opacity: 0;
        width: 0;
        height: 0;
      }

      .mq-consent-switch-slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: #404040;
        transition: 0.3s;
        border-radius: 26px;
      }

      .mq-consent-switch-slider::before {
        position: absolute;
        content: '';
        height: 20px;
        width: 20px;
        left: 3px;
        bottom: 3px;
        background: #FFFFFF;
        transition: 0.3s;
        border-radius: 50%;
      }

      .mq-consent-switch input:checked + .mq-consent-switch-slider {
        background: linear-gradient(135deg, #FFD700 0%, #D4AF37 100%);
      }

      .mq-consent-switch input:checked + .mq-consent-switch-slider::before {
        transform: translateX(22px);
      }

      .mq-consent-switch input:disabled + .mq-consent-switch-slider {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .mq-consent-switch input:focus + .mq-consent-switch-slider {
        box-shadow: 0 0 0 2px rgba(255, 215, 0, 0.3);
      }

      .mq-consent-settings-actions {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
      }

      .mq-consent-btn-save {
        background: linear-gradient(135deg, #FFD700 0%, #D4AF37 100%);
        color: #0A0A0A;
      }

      .mq-consent-btn-save:hover {
        background: linear-gradient(135deg, #FFE44D 0%, #E5C348 100%);
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(255, 215, 0, 0.3);
      }

      /* Mobile Responsive */
      @media (max-width: 768px) {
        .mq-consent-banner {
          padding: 20px 16px;
        }

        .mq-consent-main {
          flex-direction: column;
          align-items: stretch;
        }

        .mq-consent-actions {
          flex-direction: column;
          width: 100%;
        }

        .mq-consent-btn {
          width: 100%;
          text-align: center;
        }

        .mq-consent-btn-reject {
          order: 3;
        }

        .mq-consent-toggle-item {
          flex-direction: column;
          gap: 12px;
        }

        .mq-consent-switch {
          align-self: flex-start;
        }

        .mq-consent-settings-actions {
          flex-direction: column;
        }

        .mq-consent-settings-actions .mq-consent-btn {
          width: 100%;
        }
      }

      /* Reduced motion */
      @media (prefers-reduced-motion: reduce) {
        .mq-consent-overlay {
          transition: none;
        }

        .mq-consent-settings.mq-visible {
          animation: none;
        }
      }
    `;

    const styleElement = document.createElement('style');
    styleElement.id = 'mq-consent-styles';
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);
  }

  // ============================================
  // HTML INJECTION
  // ============================================

  function injectHTML() {
    const html = `
      <div class="mq-consent-overlay" id="mq-consent-overlay" role="dialog" aria-modal="true" aria-labelledby="mq-consent-title">
        <div class="mq-consent-banner">
          <div class="mq-consent-container">
            <div class="mq-consent-main">
              <div class="mq-consent-content">
                <h2 class="mq-consent-title" id="mq-consent-title">Cookie Preferences</h2>
                <p class="mq-consent-text">
                  We use cookies to analyze site traffic and optimize your experience.
                  Essential cookies are required for the site to function. Analytics cookies help us understand how visitors interact with our site.
                  <a href="${CONFIG.privacyPolicyUrl}" target="_blank" rel="noopener">Learn more in our Privacy Policy</a>.
                </p>
              </div>
              <div class="mq-consent-actions">
                <button type="button" class="mq-consent-btn mq-consent-btn-accept" id="mq-consent-accept">
                  Accept All
                </button>
                <button type="button" class="mq-consent-btn mq-consent-btn-settings" id="mq-consent-settings-btn">
                  Settings
                </button>
                <button type="button" class="mq-consent-btn mq-consent-btn-reject" id="mq-consent-reject">
                  Reject
                </button>
              </div>
            </div>

            <div class="mq-consent-settings" id="mq-consent-settings-panel">
              <h3 class="mq-consent-settings-title">Manage Cookie Preferences</h3>

              <div class="mq-consent-toggle-group">
                <div class="mq-consent-toggle-item">
                  <div class="mq-consent-toggle-info">
                    <p class="mq-consent-toggle-label">
                      Essential Cookies
                      <span class="mq-consent-toggle-badge mq-consent-toggle-badge-required">Required</span>
                    </p>
                    <p class="mq-consent-toggle-desc">
                      These cookies are necessary for the website to function and cannot be disabled. They enable core functionality such as security, network management, and accessibility.
                    </p>
                  </div>
                  <label class="mq-consent-switch">
                    <input type="checkbox" checked disabled id="mq-toggle-essential">
                    <span class="mq-consent-switch-slider"></span>
                  </label>
                </div>

                <div class="mq-consent-toggle-item">
                  <div class="mq-consent-toggle-info">
                    <p class="mq-consent-toggle-label">
                      Analytics Cookies
                      <span class="mq-consent-toggle-badge mq-consent-toggle-badge-optional">Optional</span>
                    </p>
                    <p class="mq-consent-toggle-desc">
                      These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. We use Google Analytics and Ahrefs to analyze site traffic.
                    </p>
                  </div>
                  <label class="mq-consent-switch">
                    <input type="checkbox" id="mq-toggle-analytics" ${CONFIG.defaultAnalytics ? 'checked' : ''}>
                    <span class="mq-consent-switch-slider"></span>
                  </label>
                </div>
              </div>

              <div class="mq-consent-settings-actions">
                <button type="button" class="mq-consent-btn mq-consent-btn-save" id="mq-consent-save">
                  Save Preferences
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    const container = document.createElement('div');
    container.innerHTML = html;
    document.body.appendChild(container.firstElementChild);
  }

  // ============================================
  // EVENT HANDLERS
  // ============================================

  function bindEvents() {
    const overlay = document.getElementById('mq-consent-overlay');
    const acceptBtn = document.getElementById('mq-consent-accept');
    const rejectBtn = document.getElementById('mq-consent-reject');
    const settingsBtn = document.getElementById('mq-consent-settings-btn');
    const settingsPanel = document.getElementById('mq-consent-settings-panel');
    const saveBtn = document.getElementById('mq-consent-save');
    const analyticsToggle = document.getElementById('mq-toggle-analytics');

    // Accept all
    acceptBtn.addEventListener('click', function() {
      saveConsent({ analytics: true });
      hideBanner();
    });

    // Reject all (non-essential)
    rejectBtn.addEventListener('click', function() {
      saveConsent({ analytics: false });
      hideBanner();
    });

    // Toggle settings panel
    settingsBtn.addEventListener('click', function() {
      settingsPanel.classList.toggle('mq-visible');
      const isExpanded = settingsPanel.classList.contains('mq-visible');
      settingsBtn.setAttribute('aria-expanded', isExpanded);
      settingsBtn.textContent = isExpanded ? 'Hide Settings' : 'Settings';
    });

    // Save preferences
    saveBtn.addEventListener('click', function() {
      saveConsent({ analytics: analyticsToggle.checked });
      hideBanner();
    });

    // Keyboard accessibility - close on Escape
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && overlay.classList.contains('mq-visible')) {
        // On escape, reject non-essential (safe default)
        saveConsent({ analytics: false });
        hideBanner();
      }
    });
  }

  function showBanner() {
    const overlay = document.getElementById('mq-consent-overlay');
    // Use requestAnimationFrame to ensure the element is rendered before animating
    requestAnimationFrame(function() {
      requestAnimationFrame(function() {
        overlay.classList.add('mq-visible');
      });
    });
  }

  function hideBanner() {
    const overlay = document.getElementById('mq-consent-overlay');
    overlay.classList.remove('mq-visible');

    // Remove from DOM after animation completes
    setTimeout(function() {
      overlay.classList.add('mq-hidden');
    }, 400);
  }

  // ============================================
  // PUBLIC API
  // ============================================

  window.MajestIQConsent = {
    /**
     * Check if user has given any consent (made a choice)
     * @returns {boolean}
     */
    hasConsent: function() {
      return hasConsent();
    },

    /**
     * Check if analytics consent was given
     * @returns {boolean}
     */
    hasAnalyticsConsent: function() {
      return hasAnalyticsConsent();
    },

    /**
     * Get the full consent object
     * @returns {Object|null} Consent object with essential, analytics, timestamp, version
     */
    getConsent: function() {
      return consentState ? { ...consentState } : null;
    },

    /**
     * Register a callback to be called when any consent is given
     * If consent already exists, callback fires immediately
     * @param {Function} callback - Function to call with consent object
     */
    onConsent: function(callback) {
      if (typeof callback !== 'function') return;

      if (hasConsent()) {
        callback(consentState);
      } else {
        consentCallbacks.push(callback);
      }
    },

    /**
     * Register a callback to be called when analytics consent is given
     * If analytics consent already exists, callback fires immediately
     * This is the primary method for loading analytics scripts
     * @param {Function} callback - Function to call when analytics allowed
     */
    onAnalyticsConsent: function(callback) {
      if (typeof callback !== 'function') return;

      if (hasAnalyticsConsent()) {
        callback();
      } else {
        analyticsCallbacks.push(callback);
      }
    },

    /**
     * Manually show the consent banner (e.g., from a "Cookie Settings" link)
     */
    showBanner: function() {
      const overlay = document.getElementById('mq-consent-overlay');
      if (overlay) {
        overlay.classList.remove('mq-hidden');
        showBanner();
      }
    },

    /**
     * Reset consent (useful for testing or "Manage Cookies" functionality)
     * Clears stored consent and shows banner again
     */
    reset: function() {
      document.cookie = CONFIG.cookieName + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      consentState = null;
      consentCallbacks = [];
      analyticsCallbacks = [];

      const overlay = document.getElementById('mq-consent-overlay');
      if (overlay) {
        overlay.classList.remove('mq-hidden');
        document.getElementById('mq-consent-settings-panel').classList.remove('mq-visible');
        document.getElementById('mq-toggle-analytics').checked = CONFIG.defaultAnalytics;
        showBanner();
      }
    }
  };

  // ============================================
  // INITIALIZATION
  // ============================================

  function init() {
    // Check for existing consent
    const storedConsent = getStoredConsent();

    if (storedConsent) {
      // User has already made a choice
      consentState = storedConsent;

      // Fire analytics callbacks if consent was given
      if (storedConsent.analytics) {
        // Use setTimeout to allow scripts to register callbacks first
        setTimeout(function() {
          analyticsCallbacks.forEach(function(cb) { cb(); });
        }, 0);
      }

      return; // Don't show banner
    }

    // No stored consent - show banner
    injectStyles();
    injectHTML();
    bindEvents();

    // Show banner with slight delay for smooth animation
    setTimeout(showBanner, 100);
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
