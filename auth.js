/* ==========================================================================
   Sanjay Textiles - Authentication Handler (User & Admin Portals + Admin Signup)
   ========================================================================== */

class AuthManager {
  constructor() {
    this.currentMode = 'user'; // 'user' or 'admin'
    this.authTab = 'login';    // 'login' or 'signup'
  }

  init() {
    this.bindEvents();
    this.checkExistingSession();
  }

  bindEvents() {
    // Mode switcher (User vs Admin)
    const userRoleBtn = document.getElementById('roleBtnUser');
    const adminRoleBtn = document.getElementById('roleBtnAdmin');

    if (userRoleBtn && adminRoleBtn) {
      userRoleBtn.addEventListener('click', () => this.switchRoleMode('user'));
      adminRoleBtn.addEventListener('click', () => this.switchRoleMode('admin'));
    }

    // Tab switcher (Login vs Signup)
    const tabBtnLogin = document.getElementById('tabBtnLogin');
    const tabBtnSignup = document.getElementById('tabBtnSignup');

    if (tabBtnLogin && tabBtnSignup) {
      tabBtnLogin.addEventListener('click', () => this.switchAuthTab('login'));
      tabBtnSignup.addEventListener('click', () => this.switchAuthTab('signup'));
    }

    // Quick Fill Demo Buttons
    const demoUserBtn = document.getElementById('btnDemoUser');
    const demoAdminBtn = document.getElementById('btnDemoAdmin');

    if (demoUserBtn) {
      demoUserBtn.addEventListener('click', () => this.fillDemoCredentials('user'));
    }
    if (demoAdminBtn) {
      demoAdminBtn.addEventListener('click', () => this.fillDemoCredentials('admin'));
    }

    // Form Submissions
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const adminSignupForm = document.getElementById('adminSignupForm');

    if (loginForm) {
      loginForm.addEventListener('submit', (e) => this.handleLogin(e));
    }
    if (signupForm) {
      signupForm.addEventListener('submit', (e) => this.handleUserSignup(e));
    }
    if (adminSignupForm) {
      adminSignupForm.addEventListener('submit', (e) => this.handleAdminSignup(e));
    }

    // Password Toggle
    const pwdToggles = document.querySelectorAll('.toggle-pwd-btn');
    pwdToggles.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const input = e.target.closest('.form-group').querySelector('input');
        if (input) {
          input.type = input.type === 'password' ? 'text' : 'password';
        }
      });
    });
  }

  switchRoleMode(mode) {
    this.currentMode = mode;
    const userRoleBtn = document.getElementById('roleBtnUser');
    const adminRoleBtn = document.getElementById('roleBtnAdmin');
    const portalTitle = document.getElementById('authPortalTitle');
    const portalSub = document.getElementById('authPortalSubtitle');
    const tabBtnSignup = document.getElementById('tabBtnSignup');

    if (mode === 'user') {
      userRoleBtn.classList.add('active');
      adminRoleBtn.classList.remove('active', 'admin-mode');
      portalTitle.innerHTML = `Welcome to <span class="text-gradient">Sanjay Textiles</span>`;
      portalSub.innerText = "Empowering sustainable textile recycling & rewards";
    } else {
      adminRoleBtn.classList.add('active', 'admin-mode');
      userRoleBtn.classList.remove('active');
      portalTitle.innerHTML = `Admin <span class="text-gradient-indigo">Control Center</span>`;
      portalSub.innerText = "Facility management & textile waste operations";
    }

    // Ensure tab view updates properly according to active authTab
    this.switchAuthTab(this.authTab);
  }

  switchAuthTab(tab) {
    this.authTab = tab;
    const tabBtnLogin = document.getElementById('tabBtnLogin');
    const tabBtnSignup = document.getElementById('tabBtnSignup');
    const loginFormContainer = document.getElementById('loginFormContainer');
    const signupFormContainer = document.getElementById('signupFormContainer');
    const adminSignupFormContainer = document.getElementById('adminSignupFormContainer');

    if (tab === 'login') {
      tabBtnLogin.classList.add('active');
      if (tabBtnSignup) tabBtnSignup.classList.remove('active');
      loginFormContainer.style.display = 'block';
      if (signupFormContainer) signupFormContainer.style.display = 'none';
      if (adminSignupFormContainer) adminSignupFormContainer.style.display = 'none';
    } else {
      if (tabBtnSignup) tabBtnSignup.classList.add('active');
      tabBtnLogin.classList.remove('active');
      loginFormContainer.style.display = 'none';

      if (this.currentMode === 'admin') {
        if (signupFormContainer) signupFormContainer.style.display = 'none';
        if (adminSignupFormContainer) adminSignupFormContainer.style.display = 'block';
      } else {
        if (signupFormContainer) signupFormContainer.style.display = 'block';
        if (adminSignupFormContainer) adminSignupFormContainer.style.display = 'none';
      }
    }
  }

  fillDemoCredentials(role) {
    if (role === 'user') {
      this.switchRoleMode('user');
      this.switchAuthTab('login');
      document.getElementById('loginEmail').value = 'user@sanjaytextiles.com';
      document.getElementById('loginPassword').value = 'password123';
      window.app.showToast('✨ Sanjay Textiles Demo User credentials loaded!', 'info');
    } else if (role === 'admin') {
      this.switchRoleMode('admin');
      this.switchAuthTab('login');
      document.getElementById('loginEmail').value = 'admin@sanjaytextiles.com';
      document.getElementById('loginPassword').value = 'admin123';
      window.app.showToast('🛡️ Sanjay Textiles Demo Admin credentials loaded!', 'info');
    }
  }

  handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();

    if (!email || !password) {
      window.app.showToast('Please enter both email and password', 'warning');
      return;
    }

    const store = window.db.get();
    const user = store.users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);

    if (!user) {
      window.app.showToast('Invalid email or password', 'danger');
      return;
    }

    // Role check
    if (this.currentMode === 'admin' && user.role !== 'admin') {
      window.app.showToast('Access denied. This account does not have Admin privileges.', 'danger');
      return;
    }

    window.db.setCurrentUserSession(user);
    window.app.showToast(`🎉 Login successful! Welcome to Sanjay Textiles, ${user.name}`, 'success');
    
    setTimeout(() => {
      window.app.loadDashboard(user);
    }, 600);
  }

  handleUserSignup(e) {
    e.preventDefault();
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const roleType = document.getElementById('signupRoleType').value;
    const org = document.getElementById('signupOrg').value.trim() || 'Individual';
    const password = document.getElementById('signupPassword').value.trim();

    if (!name || !email || !password) {
      window.app.showToast('Please complete all required signup fields', 'warning');
      return;
    }

    const store = window.db.get();

    if (store.users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      window.app.showToast('An account with this email already exists', 'warning');
      return;
    }

    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) || 'ST';

    const newUser = {
      id: 'usr_' + Date.now(),
      email: email,
      password: password,
      name: name,
      role: 'donor',
      userType: roleType,
      organization: org,
      points: 100,
      carbonCredits: 10.0,
      badge: 'Bronze Eco Pioneer',
      avatar: initials,
      impact: { wasteKg: 0, co2SavedKg: 0, waterSavedL: 0 }
    };

    store.users.push(newUser);
    window.db.save(store);

    window.db.setCurrentUserSession(newUser);
    window.app.showToast('🎁 Account created! You earned 100 Welcome Bonus Eco Points!', 'success');

    setTimeout(() => {
      window.app.loadDashboard(newUser);
    }, 600);
  }

  handleAdminSignup(e) {
    e.preventDefault();
    const name = document.getElementById('adminSignupName').value.trim();
    const email = document.getElementById('adminSignupEmail').value.trim();
    const plant = document.getElementById('adminSignupPlant').value;
    const securityCode = document.getElementById('adminSecurityCode').value.trim();
    const password = document.getElementById('adminSignupPassword').value.trim();

    if (!name || !email || !password || !securityCode) {
      window.app.showToast('Please complete all required fields for Admin Signup', 'warning');
      return;
    }

    // Verify Admin Security Key (Default key: ADMIN2026 or SANJAY2026)
    if (securityCode !== 'ADMIN2026' && securityCode !== 'SANJAY2026') {
      window.app.showToast('Invalid Admin Security Passcode! (Default Passcode: ADMIN2026)', 'danger');
      return;
    }

    const store = window.db.get();

    if (store.users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      window.app.showToast('An Admin account with this email already exists', 'warning');
      return;
    }

    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) || 'AD';

    const newAdmin = {
      id: 'admin_' + Date.now(),
      email: email,
      password: password,
      name: name,
      role: 'admin',
      organization: plant,
      points: 9999,
      carbonCredits: 500.0,
      badge: 'System Administrator',
      avatar: initials,
      impact: { wasteKg: 0, co2SavedKg: 0, waterSavedL: 0 }
    };

    store.users.push(newAdmin);
    window.db.save(store);

    window.db.setCurrentUserSession(newAdmin);
    window.app.showToast(`🛡️ Admin Account Created! Welcome ${name}`, 'success');

    setTimeout(() => {
      window.app.loadDashboard(newAdmin);
    }, 600);
  }

  checkExistingSession() {
    const currentUser = window.db.getCurrentUser();
    if (currentUser) {
      window.app.loadDashboard(currentUser);
    }
  }
}

window.authMgr = new AuthManager();
