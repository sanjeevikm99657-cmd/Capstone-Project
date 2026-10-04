/* ==========================================================================
   Sanjay Textiles - User Dashboard & Feature Suite Manager
   ========================================================================== */

class UserDashboardManager {
  constructor() {
    this.selectedFabric = 'cotton';
    this.cart = [];
  }

  init(user) {
    this.user = user;
    this.renderUserHeader();
    this.renderUserStats();
    this.renderPickupsTable();
    this.initPickupWizard();
    this.initAiFabricScanner();
    this.renderMarketplace();
    this.renderDropoffHubs();
    this.renderLeaderboard();
    this.renderFleetTracker();
    this.initNotificationBell();
    
    // Render Chart
    setTimeout(() => {
      window.chartMgr.initUserImpactChart('userImpactChartCanvas');
    }, 100);
  }

  renderUserHeader() {
    const pointsElem = document.getElementById('userPointsDisplay');
    const badgeElem = document.getElementById('userBadgeDisplay');
    const avatarElem = document.getElementById('userAvatarDisplay');
    const nameElem = document.getElementById('userNameDisplay');
    const creditsElem = document.getElementById('userCarbonCreditsDisplay');

    if (pointsElem) pointsElem.innerText = `${this.user.points} Pts`;
    if (badgeElem) badgeElem.innerText = this.user.badge;
    if (avatarElem) avatarElem.innerText = this.user.avatar || 'US';
    if (nameElem) nameElem.innerText = this.user.name;
    if (creditsElem) creditsElem.innerText = `${(this.user.carbonCredits || 0).toFixed(1)} SEC`;
  }

  renderUserStats() {
    const impact = this.user.impact || { wasteKg: 0, co2SavedKg: 0, waterSavedL: 0 };
    
    const wasteElem = document.getElementById('statUserWaste');
    const co2Elem = document.getElementById('statUserCo2');
    const waterElem = document.getElementById('statUserWater');
    const pointsElem = document.getElementById('statUserPoints');

    if (wasteElem) wasteElem.innerText = `${impact.wasteKg.toFixed(1)} kg`;
    if (co2Elem) co2Elem.innerText = `${impact.co2SavedKg.toFixed(1)} kg`;
    if (waterElem) waterElem.innerText = `${impact.waterSavedL.toLocaleString()} L`;
    if (pointsElem) pointsElem.innerText = `${this.user.points}`;
  }

  initNotificationBell() {
    const bellBtn = document.getElementById('userNotifBellBtn');
    const popover = document.getElementById('userNotifPopover');

    if (bellBtn && popover) {
      bellBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        popover.classList.toggle('active');
      });

      document.addEventListener('click', () => {
        popover.classList.remove('active');
      });
    }
  }

  renderPickupsTable() {
    const tableBody = document.getElementById('userPickupsTableBody');
    if (!tableBody) return;

    const store = window.db.get();
    const userPickups = store.pickups.filter(p => p.userId === this.user.id || p.userName.includes(this.user.name));

    if (userPickups.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; padding: 2rem; color: var(--text-muted);">
            No textile pickup requests submitted yet. Click <strong>"Schedule Waste Pickup"</strong> above!
          </td>
        </tr>
      `;
      return;
    }

    tableBody.innerHTML = userPickups.map(p => {
      let statusBadge = '';
      if (p.status.includes('Pending')) statusBadge = `<span class="badge badge-warning">⏳ ${p.status}</span>`;
      else if (p.status.includes('Dispatched')) statusBadge = `<span class="badge badge-indigo">🚛 ${p.status}</span>`;
      else if (p.status.includes('Recycled') || p.status.includes('Upcycled')) statusBadge = `<span class="badge badge-emerald">♻️ ${p.status}</span>`;
      else statusBadge = `<span class="badge badge-pink">${p.status}</span>`;

      return `
        <tr>
          <td><strong style="color: var(--primary-emerald);">${p.id}</strong></td>
          <td>${p.fabricType}</td>
          <td><strong>${p.weightKg} kg</strong></td>
          <td>${p.serviceType}</td>
          <td>${statusBadge}</td>
          <td><span style="color: var(--warning); font-weight:700;">+${p.estPoints} Pts</span></td>
          <td>
            <button class="btn btn-outline btn-sm" onclick="window.userMgr.openQrModal('${p.id}')">
              📱 View QR Code
            </button>
          </td>
        </tr>
      `;
    }).join('');
  }

  openQrModal(pickupId) {
    const store = window.db.get();
    const pickup = store.pickups.find(p => p.id === pickupId);

    if (!pickup) return;

    const qrTitle = document.getElementById('qrModalTitle');
    const qrInfo = document.getElementById('qrModalInfo');
    const qrText = document.getElementById('qrCodeValueText');

    if (qrTitle) qrTitle.innerText = `Digital Batch QR Label: ${pickup.id}`;
    if (qrInfo) {
      qrInfo.innerHTML = `
        <strong>Donor:</strong> ${pickup.userName}<br/>
        <strong>Fabric:</strong> ${pickup.fabricType} (${pickup.weightKg} kg)<br/>
        <strong>Scheduled Slot:</strong> ${pickup.dateSlot}
      `;
    }
    if (qrText) qrText.innerText = pickup.qrCode || `ST-QR-${pickup.id}`;

    const modal = document.getElementById('qrModal');
    if (modal) modal.classList.add('active');
  }

  closeQrModal() {
    const modal = document.getElementById('qrModal');
    if (modal) modal.classList.remove('active');
  }

  initPickupWizard() {
    const fabricBoxes = document.querySelectorAll('.fabric-type-box');
    const weightInput = document.getElementById('pickupWeightInput');

    fabricBoxes.forEach(box => {
      box.addEventListener('click', () => {
        fabricBoxes.forEach(b => b.classList.remove('selected'));
        box.classList.add('selected');
        this.selectedFabric = box.dataset.fabric;
        this.calculatePickupEstimates();
      });
    });

    if (weightInput) {
      weightInput.addEventListener('input', () => this.calculatePickupEstimates());
    }

    const pickupForm = document.getElementById('pickupScheduleForm');
    if (pickupForm) {
      pickupForm.addEventListener('submit', (e) => this.handlePickupSubmit(e));
    }
  }

  calculatePickupEstimates() {
    const weightInput = document.getElementById('pickupWeightInput');
    const estPointsSpan = document.getElementById('wizardEstPoints');
    const estCo2Span = document.getElementById('wizardEstCo2');

    const weight = parseFloat(weightInput.value) || 0;
    
    let multiplier = 10;
    if (this.selectedFabric === 'silk' || this.selectedFabric === 'denim') multiplier = 12;
    if (this.selectedFabric === 'cotton') multiplier = 10;
    if (this.selectedFabric === 'polyester') multiplier = 8;

    const estPoints = Math.round(weight * multiplier);
    const estCo2 = (weight * 2.7).toFixed(1);

    if (estPointsSpan) estPointsSpan.innerText = `+${estPoints} Eco Points`;
    if (estCo2Span) estCo2Span.innerText = `${estCo2} kg CO₂ Offset`;
  }

  handlePickupSubmit(e) {
    e.preventDefault();
    const weight = parseFloat(document.getElementById('pickupWeightInput').value) || 0;
    const condition = document.getElementById('pickupConditionSelect').value;
    const serviceType = document.getElementById('pickupServiceSelect').value;
    const address = document.getElementById('pickupAddressInput').value;
    const dateSlot = document.getElementById('pickupDateInput').value;

    if (weight <= 0 || !address || !dateSlot) {
      window.app.showToast('Please fill out all required pickup details', 'warning');
      return;
    }

    const estPoints = Math.round(weight * 10);
    const co2Offset = parseFloat((weight * 2.7).toFixed(1));
    const randomCode = "ST-QR-" + Math.floor(1000 + Math.random() * 9000);

    const newPickup = {
      id: "PK-" + Math.floor(1000 + Math.random() * 9000),
      qrCode: randomCode,
      userId: this.user.id,
      userName: this.user.name,
      fabricType: this.selectedFabric.toUpperCase() + " Textile Waste",
      fabricCategory: this.selectedFabric,
      weightKg: weight,
      condition: condition,
      serviceType: serviceType,
      address: address,
      dateSlot: dateSlot,
      status: "Pending Approval",
      estPoints: estPoints,
      co2Offset: co2Offset,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    const store = window.db.get();
    store.pickups.unshift(newPickup);

    // Update user stats & carbon credits
    const userObj = store.users.find(u => u.id === this.user.id);
    if (userObj) {
      userObj.impact.wasteKg += weight;
      userObj.impact.co2SavedKg += co2Offset;
      userObj.impact.waterSavedL += Math.round(weight * 10);
      userObj.points += estPoints;
      userObj.carbonCredits = (userObj.carbonCredits || 0) + (co2Offset / 10);
      this.user = userObj;
    }

    window.db.save(store);

    window.app.showToast(`🎉 Pickup scheduled! Batch QR Label: ${randomCode}. Earned +${estPoints} Pts!`, 'success');

    document.getElementById('pickupScheduleForm').reset();
    this.renderUserStats();
    this.renderUserHeader();
    this.renderPickupsTable();
    window.app.switchTab('tabUserOverview');
  }

  initAiFabricScanner() {
    const scanBox = document.getElementById('aiScannerBox');
    const presetBtns = document.querySelectorAll('.sample-fabric-btn');

    if (presetBtns) {
      presetBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const sample = btn.dataset.sample;
          this.triggerAiScan(sample);
        });
      });
    }

    if (scanBox) {
      scanBox.addEventListener('click', () => {
        this.triggerAiScan('custom');
      });
    }
  }

  triggerAiScan(sampleType) {
    const scanLine = document.getElementById('aiScanLine');
    const resultBox = document.getElementById('aiScanResultBox');
    const scanText = document.getElementById('aiScanStatusText');
    const placeholder = document.getElementById('aiScanPlaceholder');

    if (scanLine) scanLine.style.display = 'block';
    if (scanText) scanText.innerText = "🔍 AI Neural Engine analyzing fiber weave & polymer matrix...";
    if (resultBox) resultBox.style.display = 'none';

    setTimeout(() => {
      if (scanLine) scanLine.style.display = 'none';
      if (scanText) scanText.innerText = "✨ Fabric Scan Complete! Analysis details below:";
      if (placeholder) placeholder.style.display = 'none';

      let mockResult = {
        name: "Pre-loved Denim Twill",
        composition: "98% Organic Cotton, 2% Elastane",
        recyclability: "94% High Recyclability",
        recommendation: "Upcycle to Heavy Duty Canvas Tote Bags or Mechanical Carding into Recycled Denim Yarn.",
        valuePerKg: "$1.40 / kg"
      };

      if (sampleType === 'polyester') {
        mockResult = {
          name: "Sportswear Synthetic Jersey",
          composition: "100% Recycled PET Polyester",
          recyclability: "88% Chemical Fiber Extraction",
          recommendation: "Depolymerization Chemical Recycling back to Pure PET Pellets.",
          valuePerKg: "$0.95 / kg"
        };
      } else if (sampleType === 'silk') {
        mockResult = {
          name: "Artisan Mulberry Silk Offcut",
          composition: "100% Pure Natural Protein Silk",
          recyclability: "99% Premium Luxury Upcycle",
          recommendation: "Direct Boutique Tailor Crafting / Luxury Patchwork Accessories.",
          valuePerKg: "$4.50 / kg"
        };
      }

      const resTitle = document.getElementById('aiResTitle');
      const resComp = document.getElementById('aiResComp');
      const resScore = document.getElementById('aiResScore');
      const resRec = document.getElementById('aiResRec');
      const resValue = document.getElementById('aiResValue');

      if (resTitle) resTitle.innerText = mockResult.name;
      if (resComp) resComp.innerText = mockResult.composition;
      if (resScore) resScore.innerText = mockResult.recyclability;
      if (resRec) resRec.innerText = mockResult.recommendation;
      if (resValue) resValue.innerText = mockResult.valuePerKg;

      if (resultBox) {
        resultBox.style.display = 'block';
        resultBox.scrollIntoView({ behavior: 'smooth' });
      }

      window.app.showToast('🧠 AI Fabric Analysis completed successfully!', 'info');
    }, 1800);
  }

  renderMarketplace() {
    const grid = document.getElementById('marketplaceGrid');
    if (!grid) return;

    const store = window.db.get();
    const items = store.marketplace;

    grid.innerHTML = items.map(item => `
      <div class="glass-panel-interactive product-card">
        <div class="product-img-box">
          <img src="${item.image}" alt="${item.title}" style="width: 100%; height: 100%; object-fit: cover;" />
          <span class="badge badge-emerald product-badge-pts">⭐ ${item.pointsPrice} Pts</span>
        </div>
        <div class="product-body">
          <span class="badge badge-indigo" style="width: fit-content; margin-bottom: 0.5rem;">${item.category}</span>
          <h3 class="product-title">${item.title}</h3>
          <p class="product-desc">${item.description}</p>
          <div style="font-size: 0.78rem; color: var(--primary-emerald); font-weight:700; margin-bottom: 0.75rem;">
            🌱 ${item.recycledWeight}
          </div>
          <div class="product-footer">
            <div>
              <div style="font-size: 0.75rem; color: var(--text-muted);">Redeem Option</div>
              <div class="product-price">$${item.cashPrice.toFixed(2)} <span style="font-size: 0.8rem; color: var(--text-muted); font-weight: normal;">or ${item.pointsPrice} Pts</span></div>
            </div>
            <button class="btn btn-primary btn-sm" onclick="window.userMgr.redeemItem('${item.id}')">
              Redeem Now
            </button>
          </div>
        </div>
      </div>
    `).join('');
  }

  redeemItem(itemId) {
    const store = window.db.get();
    const item = store.marketplace.find(i => i.id === itemId);
    if (!item) return;

    if (this.user.points < item.pointsPrice) {
      window.app.showToast(`Insufficient Eco Points! You need ${item.pointsPrice} Pts. (Your balance: ${this.user.points} Pts)`, 'warning');
      return;
    }

    this.user.points -= item.pointsPrice;
    const userInDb = store.users.find(u => u.id === this.user.id);
    if (userInDb) userInDb.points = this.user.points;
    window.db.save(store);

    this.renderUserHeader();
    this.renderUserStats();

    window.app.showToast(`🛍️ Success! Redeemed "${item.title}". Check your confirmation email for delivery dispatch!`, 'success');
  }

  renderDropoffHubs() {
    const container = document.getElementById('dropoffHubsList');
    if (!container) return;

    const store = window.db.get();
    const hubs = store.hubs;

    container.innerHTML = hubs.map(hub => `
      <div class="glass-panel" style="padding: 1.25rem; margin-bottom: 1rem; border-left: 4px solid var(--primary-emerald);">
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <div>
            <h4 style="font-size: 1.1rem; color: #ffffff; margin-bottom: 0.3rem;">📍 ${hub.name}</h4>
            <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 0.5rem;">${hub.address}</p>
          </div>
          <span class="badge badge-emerald">Cap: ${hub.capacity}% Full</span>
        </div>
        <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.75rem;">
          🕒 <strong>Hours:</strong> ${hub.hours} | 📞 ${hub.contact}
        </div>
        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
          ${hub.acceptedTypes.map(t => `<span class="badge badge-indigo">${t}</span>`).join('')}
        </div>
      </div>
    `).join('');
  }

  renderLeaderboard() {
    const tableBody = document.getElementById('leaderboardTableBody');
    if (!tableBody) return;

    const store = window.db.get();
    const board = store.leaderboard || [];

    tableBody.innerHTML = board.map(item => {
      let rankBadgeClass = 'rank-3';
      if (item.rank === 1) rankBadgeClass = 'rank-1';
      if (item.rank === 2) rankBadgeClass = 'rank-2';

      return `
        <tr>
          <td><div class="rank-badge ${rankBadgeClass}">${item.rank}</div></td>
          <td>
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <div class="avatar-circle">${item.avatar}</div>
              <div>
                <strong>${item.name}</strong><br/>
                <span style="font-size: 0.78rem; color: var(--text-muted);">${item.category}</span>
              </div>
            </div>
          </td>
          <td><strong>${item.wasteKg} kg</strong></td>
          <td><span class="badge badge-gold">⭐ ${item.points} Pts</span></td>
        </tr>
      `;
    }).join('');
  }

  renderFleetTracker() {
    const container = document.getElementById('fleetDriverList');
    if (!container) return;

    const store = window.db.get();
    const fleet = store.fleet || [];

    container.innerHTML = fleet.map(truck => `
      <div style="padding: 1rem; background: rgba(10, 15, 26, 0.6); border: 1px solid var(--border-light); border-radius: 8px; margin-bottom: 0.75rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
          <strong style="color: var(--primary-emerald);" class="truck-pulse">🚛 ${truck.truckId} - ${truck.driverName}</strong>
          <span class="badge badge-indigo">ETA: ${truck.etaMinutes} mins</span>
        </div>
        <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.4rem;">
          📍 <strong>Route:</strong> ${truck.assignedRoute}
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.78rem;">
          <span style="color: var(--warning);">Status: ${truck.status}</span>
          <a href="tel:${truck.phone}" style="color: var(--primary-cyan); text-decoration: none; font-weight: 700;">📞 Call Driver</a>
        </div>
      </div>
    `).join('');
  }

  exchangeCarbonCredits() {
    const credits = this.user.carbonCredits || 0;
    if (credits <= 0) {
      window.app.showToast('You do not have any SEC Carbon Credits to trade right now.', 'warning');
      return;
    }

    const cashValue = (credits * 2.50).toFixed(2);
    window.app.showToast(`💰 Successfully converted ${credits.toFixed(1)} SEC credits to $${cashValue} ESG Voucher!`, 'success');
  }
}

window.userMgr = new UserDashboardManager();
