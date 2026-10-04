/* ==========================================================================
   Sanjay Textiles - Main Application Orchestration Engine
   (Includes Multi-Language Translation Dictionary & Theme Manager)
   ========================================================================== */

const TRANSLATIONS = {
  en: {
    portalTitle: "Welcome to",
    portalSubtitle: "Empowering sustainable textile recycling & rewards",
    userPortal: "👤 User Portal",
    adminPortal: "🛡️ Admin Portal",
    signIn: "Sign In",
    createAccount: "Create Account",
    emailLabel: "Email Address",
    passwordLabel: "Password",
    rememberMe: "Remember me",
    quickDemo: "⚡ 1-Click Quick Demo Login",
    demoUserBtn: "👤 Fill Demo User",
    demoAdminBtn: "🛡️ Fill Demo Admin",
    overviewTab: "📊 Overview & Impact",
    scheduleTab: "🚚 Schedule Pickup",
    aiScannerTab: "🧠 AI Fabric Scanner",
    leaderboardTab: "🏆 Community Leaderboard",
    carbonTab: "🌱 Carbon Credit Exchange",
    marketplaceTab: "🛍️ Upcycled Marketplace",
    hubsTab: "📍 Drop-off Locations",
    impactTitle: "Impact Dashboard",
    wasteDiverted: "Total Waste Diverted",
    co2Saved: "CO₂ Emissions Saved",
    waterConserved: "Water Conserved",
    pointsBalance: "Eco Reward Points"
  },
  hi: {
    portalTitle: "स्वागत है",
    portalSubtitle: "सतत कपड़ा रीसाइक्लिंग और पुरस्कारों को सशक्त बनाना",
    userPortal: "👤 उपयोगकर्ता पोर्टल",
    adminPortal: "🛡️ एडमिन पोर्टल",
    signIn: "साइन इन करें",
    createAccount: "खाता बनाएं",
    emailLabel: "ईमेल पता",
    passwordLabel: "पासवर्ड",
    rememberMe: "मुझे याद रखें",
    quickDemo: "⚡ 1-क्लिक त्वरित डेमो लॉगिन",
    demoUserBtn: "👤 डेमो यूजर भरें",
    demoAdminBtn: "🛡️ डेमो एडमिन भरें",
    overviewTab: "📊 अवलोकन और प्रभाव",
    scheduleTab: "🚚 पिकअप शेड्यूल करें",
    aiScannerTab: "🧠 एआई फैब्रिक स्कैनर",
    leaderboardTab: "🏆 कम्युनिटी लीडरबोर्ड",
    carbonTab: "🌱 कार्बन क्रेडिट एक्सचेंज",
    marketplaceTab: "🛍️ अपसाइकिल्ड मार्केटप्लेस",
    hubsTab: "📍 ड्रॉप-ऑफ स्थान",
    impactTitle: "प्रभाव डैशबोर्ड",
    wasteDiverted: "कुल पुनर्चक्रित कचरा",
    co2Saved: "बचाया गया CO₂ उत्सर्जन",
    waterConserved: "संरक्षित जल",
    pointsBalance: "इको रिवार्ड अंक"
  },
  es: {
    portalTitle: "Bienvenido a",
    portalSubtitle: "Impulsando el reciclaje textil sostenible y recompensas",
    userPortal: "👤 Portal de Usuario",
    adminPortal: "🛡️ Portal de Admin",
    signIn: "Iniciar Sesión",
    createAccount: "Crear Cuenta",
    emailLabel: "Correo Electrónico",
    passwordLabel: "Contraseña",
    rememberMe: "Recordarme",
    quickDemo: "⚡ Acceso Demo en 1 Clic",
    demoUserBtn: "👤 Cargar Usuario Demo",
    demoAdminBtn: "🛡️ Cargar Admin Demo",
    overviewTab: "📊 Visión General e Impacto",
    scheduleTab: "🚚 Programar Recogida",
    aiScannerTab: "🧠 Escáner Textil IA",
    leaderboardTab: "🏆 Tabla de Clasificación",
    carbonTab: "🌱 Intercambio de Créditos",
    marketplaceTab: "🛍️ Mercado Reciclado",
    hubsTab: "📍 Puntos de Recogida",
    impactTitle: "Panel de Impacto",
    wasteDiverted: "Residuo Total Desviado",
    co2Saved: "CO₂ Reducido",
    waterConserved: "Agua Conservada",
    pointsBalance: "Puntos Eco"
  }
};

class App {
  constructor() {
    this.currentUser = null;
    this.isLightMode = false;
    this.currentLang = 'en';
  }

  init() {
    window.authMgr.init();
    this.bindGlobalEvents();
  }

  bindGlobalEvents() {
    // Navigation items click handler
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const targetTab = item.dataset.tab;
        if (targetTab) {
          this.switchTab(targetTab);
        }
      });
    });

    // Theme Switchers
    const themeBtnUser = document.getElementById('themeToggleUserBtn');
    const themeBtnAdmin = document.getElementById('themeToggleAdminBtn');

    if (themeBtnUser) themeBtnUser.addEventListener('click', () => this.toggleTheme());
    if (themeBtnAdmin) themeBtnAdmin.addEventListener('click', () => this.toggleTheme());

    // Language Selectors
    const langSelectUser = document.getElementById('langSelectUser');
    if (langSelectUser) {
      langSelectUser.addEventListener('change', (e) => this.switchLanguage(e.target.value));
    }

    // Logout buttons
    const userLogoutBtn = document.getElementById('userLogoutBtn');
    const adminLogoutBtn = document.getElementById('adminLogoutBtn');

    if (userLogoutBtn) userLogoutBtn.addEventListener('click', () => this.handleLogout());
    if (adminLogoutBtn) adminLogoutBtn.addEventListener('click', () => this.handleLogout());

    // Modal Closers
    const modalClosers = document.querySelectorAll('.close-modal-btn');
    modalClosers.forEach(btn => {
      btn.addEventListener('click', () => {
        const modal = btn.closest('.modal-overlay');
        if (modal) modal.classList.remove('active');
      });
    });
  }

  toggleTheme() {
    this.isLightMode = !this.isLightMode;
    if (this.isLightMode) {
      document.body.classList.add('light-theme');
      this.showToast('☀️ Switched to Light Theme', 'info');
    } else {
      document.body.classList.remove('light-theme');
      this.showToast('🌙 Switched to Dark Glass Theme', 'info');
    }
  }

  switchLanguage(lang) {
    this.currentLang = lang;
    const t = TRANSLATIONS[lang] || TRANSLATIONS['en'];

    // Update UI Elements with translations
    const titleElem = document.getElementById('authPortalSubtitle');
    if (titleElem) titleElem.innerText = t.portalSubtitle;

    const tabLogin = document.getElementById('tabBtnLogin');
    if (tabLogin) tabLogin.innerText = t.signIn;

    const tabSignup = document.getElementById('tabBtnSignup');
    if (tabSignup) tabSignup.innerText = t.createAccount;

    const btnUser = document.getElementById('btnDemoUser');
    if (btnUser) btnUser.innerText = t.demoUserBtn;

    const btnAdmin = document.getElementById('btnDemoAdmin');
    if (btnAdmin) btnAdmin.innerText = t.demoAdminBtn;

    if (lang === 'hi') {
      this.showToast('🇮🇳 भाषा बदल कर हिंदी कर दी गई है!', 'info');
    } else if (lang === 'es') {
      this.showToast('🇪🇸 ¡Idioma cambiado a Español!', 'info');
    } else {
      this.showToast('🇬🇧 Language set to English', 'info');
    }
  }

  loadDashboard(user) {
    this.currentUser = user;
    const authWrapper = document.getElementById('authWrapper');
    const userDashboardLayout = document.getElementById('userDashboardLayout');
    const adminDashboardLayout = document.getElementById('adminDashboardLayout');

    if (authWrapper) authWrapper.style.display = 'none';

    if (user.role === 'admin') {
      if (userDashboardLayout) userDashboardLayout.style.display = 'none';
      if (adminDashboardLayout) adminDashboardLayout.style.display = 'flex';
      window.adminMgr.init(user);
      this.switchTab('tabAdminOverview');
    } else {
      if (adminDashboardLayout) adminDashboardLayout.style.display = 'none';
      if (userDashboardLayout) userDashboardLayout.style.display = 'flex';
      window.userMgr.init(user);
      this.switchTab('tabUserOverview');
    }
  }

  switchTab(tabId) {
    const contents = document.querySelectorAll('.tab-content');
    contents.forEach(c => c.classList.remove('active'));

    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(n => n.classList.remove('active'));

    const targetContent = document.getElementById(tabId);
    if (targetContent) {
      targetContent.classList.add('active');
    }

    const targetNavItem = document.querySelector(`.nav-item[data-tab="${tabId}"]`);
    if (targetNavItem) {
      targetNavItem.classList.add('active');
    }

    if (tabId === 'tabUserOverview') {
      window.chartMgr.initUserImpactChart('userImpactChartCanvas');
    } else if (tabId === 'tabAdminOverview') {
      window.chartMgr.initAdminDashboardCharts();
    }
  }

  handleLogout() {
    window.db.clearSession();
    this.currentUser = null;

    document.getElementById('userDashboardLayout').style.display = 'none';
    document.getElementById('adminDashboardLayout').style.display = 'none';
    document.getElementById('authWrapper').style.display = 'flex';

    this.showToast('Logged out successfully', 'info');
  }

  showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let icon = 'ℹ️';
    if (type === 'success') icon = '✅';
    if (type === 'warning') icon = '⚠️';
    if (type === 'danger') icon = '🚨';

    toast.innerHTML = `<span>${icon}</span> <div>${message}</div>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.app = new App();
  window.app.init();
});
