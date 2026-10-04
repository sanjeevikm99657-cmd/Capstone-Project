/* ==========================================================================
   Sanjay Textiles - Admin Dashboard & Advanced Operations Manager
   ========================================================================== */

class AdminDashboardManager {
  constructor() {
    this.activeBatchPickupId = null;
    this.shredderRpm = 1800;
  }

  init(adminUser) {
    this.adminUser = adminUser;
    this.renderAdminHeader();
    this.renderAdminStats();
    this.renderAdminPickupsTable();
    this.renderUsersDirectory();
    this.renderFleetDispatch();
    
    // Render Admin Charts
    setTimeout(() => {
      window.chartMgr.initAdminDashboardCharts();
    }, 150);
  }

  renderAdminHeader() {
    const avatarElem = document.getElementById('adminAvatarDisplay');
    const nameElem = document.getElementById('adminNameDisplay');

    if (avatarElem) avatarElem.innerText = this.adminUser.avatar || 'ST';
    if (nameElem) nameElem.innerText = this.adminUser.name;
  }

  renderAdminStats() {
    const store = window.db.get();
    const totalPickups = store.pickups;

    let totalKg = 0;
    let totalCo2 = 0;

    totalPickups.forEach(p => {
      totalKg += p.weightKg || 0;
      totalCo2 += p.co2Offset || 0;
    });

    const tons = (totalKg / 1000).toFixed(2);

    const tonsElem = document.getElementById('adminStatTons');
    const co2Elem = document.getElementById('adminStatCo2');
    const pendingElem = document.getElementById('adminStatPending');
    const usersElem = document.getElementById('adminStatUsers');

    const pendingCount = totalPickups.filter(p => p.status.includes('Pending')).length;

    if (tonsElem) tonsElem.innerText = `${tons} Tons`;
    if (co2Elem) co2Elem.innerText = `${(totalCo2 / 1000).toFixed(2)} Tons`;
    if (pendingElem) pendingElem.innerText = `${pendingCount}`;
    if (usersElem) usersElem.innerText = `${store.users.length}`;
  }

  renderAdminPickupsTable() {
    const tableBody = document.getElementById('adminPickupsTableBody');
    if (!tableBody) return;

    const store = window.db.get();
    const pickups = store.pickups;

    if (pickups.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; padding: 2rem; color: var(--text-muted);">
            No pickup requests in system.
          </td>
        </tr>
      `;
      return;
    }

    tableBody.innerHTML = pickups.map(p => {
      let statusBadge = '';
      if (p.status.includes('Pending')) statusBadge = `<span class="badge badge-warning">⏳ ${p.status}</span>`;
      else if (p.status.includes('Dispatched')) statusBadge = `<span class="badge badge-indigo">🚛 ${p.status}</span>`;
      else if (p.status.includes('Recycled') || p.status.includes('Upcycled')) statusBadge = `<span class="badge badge-emerald">♻️ ${p.status}</span>`;
      else statusBadge = `<span class="badge badge-pink">${p.status}</span>`;

      return `
        <tr>
          <td>
            <strong style="color: var(--primary-indigo);">${p.id}</strong><br/>
            <span style="font-size: 0.75rem; color: var(--primary-emerald);">${p.qrCode || 'QR-ST-100'}</span>
          </td>
          <td>
            <strong>${p.userName}</strong><br/>
            <span style="font-size: 0.78rem; color: var(--text-muted);">${p.address}</span>
          </td>
          <td>${p.fabricType}</td>
          <td><strong>${p.weightKg} kg</strong></td>
          <td>${p.dateSlot}</td>
          <td>${statusBadge}</td>
          <td>
            <div style="display: flex; gap: 0.35rem;">
              <button class="btn btn-outline btn-sm" onclick="window.adminMgr.openAssignBatchModal('${p.id}')">
                ⚙️ Batch Process
              </button>
              ${p.status.includes('Pending') ? `
                <button class="btn btn-primary btn-sm" onclick="window.adminMgr.updatePickupStatus('${p.id}', 'Dispatched Collector')">
                  Approve & Dispatch
                </button>
              ` : ''}
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  openAssignBatchModal(pickupId) {
    this.activeBatchPickupId = pickupId;
    const store = window.db.get();
    const pickup = store.pickups.find(p => p.id === pickupId);

    if (!pickup) return;

    const infoElem = document.getElementById('batchModalInfo');
    if (infoElem) {
      infoElem.innerHTML = `
        <strong>Pickup ID:</strong> ${pickup.id} | <strong>QR Label:</strong> ${pickup.qrCode || 'ST-QR-100'}<br/>
        <strong>Donor:</strong> ${pickup.userName} | <strong>Fabric:</strong> ${pickup.fabricType} (${pickup.weightKg} kg)
      `;
    }

    const modal = document.getElementById('batchProcessModal');
    if (modal) modal.classList.add('active');
  }

  closeAssignBatchModal() {
    const modal = document.getElementById('batchProcessModal');
    if (modal) modal.classList.remove('active');
  }

  confirmBatchAssignment() {
    const stream = document.getElementById('batchStreamSelect').value;
    if (!this.activeBatchPickupId) return;

    const store = window.db.get();
    const pickup = store.pickups.find(p => p.id === this.activeBatchPickupId);

    if (pickup) {
      pickup.status = stream;
      window.db.save(store);
      window.app.showToast(`✨ Pickup ${pickup.id} assigned to stream: "${stream}"!`, 'success');
    }

    this.closeAssignBatchModal();
    this.renderAdminPickupsTable();
    this.renderAdminStats();
  }

  updatePickupStatus(pickupId, newStatus) {
    const store = window.db.get();
    const pickup = store.pickups.find(p => p.id === pickupId);

    if (pickup) {
      pickup.status = newStatus;
      window.db.save(store);
      window.app.showToast(`🚚 Request ${pickupId} updated to "${newStatus}"`, 'info');
      this.renderAdminPickupsTable();
      this.renderAdminStats();
    }
  }

  renderUsersDirectory() {
    const tableBody = document.getElementById('adminUsersTableBody');
    if (!tableBody) return;

    const store = window.db.get();
    const users = store.users;

    tableBody.innerHTML = users.map(u => `
      <tr>
        <td>
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <div class="avatar-circle">${u.avatar}</div>
            <div>
              <strong>${u.name}</strong><br/>
              <span style="font-size: 0.78rem; color: var(--text-muted);">${u.email}</span>
            </div>
          </div>
        </td>
        <td><span class="badge ${u.role === 'admin' ? 'badge-indigo' : 'badge-emerald'}">${u.role.toUpperCase()}</span></td>
        <td>${u.organization || 'Individual'}</td>
        <td><span class="badge badge-warning">⭐ ${u.points} Pts</span></td>
        <td><strong>${u.impact ? u.impact.wasteKg.toFixed(1) : 0} kg</strong></td>
        <td>
          <button class="btn btn-outline btn-sm" onclick="window.adminMgr.awardBonusPoints('${u.id}')">
            + Award Bonus Pts
          </button>
        </td>
      </tr>
    `).join('');
  }

  awardBonusPoints(userId) {
    const store = window.db.get();
    const user = store.users.find(u => u.id === userId);

    if (user) {
      user.points += 250;
      window.db.save(store);
      window.app.showToast(`🎁 Awarded +250 Bonus Eco Points to ${user.name}!`, 'success');
      this.renderUsersDirectory();
    }
  }

  renderFleetDispatch() {
    const tableBody = document.getElementById('adminFleetTableBody');
    if (!tableBody) return;

    const store = window.db.get();
    const fleet = store.fleet || [];

    tableBody.innerHTML = fleet.map(truck => `
      <tr>
        <td><strong style="color: var(--primary-emerald);">🚛 ${truck.truckId}</strong></td>
        <td><strong>${truck.driverName}</strong><br/><span style="font-size: 0.75rem; color: var(--text-muted);">${truck.phone}</span></td>
        <td>${truck.assignedRoute}</td>
        <td><span class="badge badge-warning">${truck.currentLoadKg} / ${truck.capacityKg} kg</span></td>
        <td><span class="badge badge-indigo">${truck.status}</span></td>
        <td>
          <button class="btn btn-primary btn-sm" onclick="window.app.showToast('📡 GPS Ping sent to ${truck.driverName}', 'info')">
            📡 Ping Driver
          </button>
        </td>
      </tr>
    `).join('');
  }

  adjustShredderSpeed(delta) {
    this.shredderRpm = Math.max(800, Math.min(3000, this.shredderRpm + delta));
    const rpmElem = document.getElementById('shredderRpmText');
    if (rpmElem) rpmElem.innerText = `${this.shredderRpm} RPM`;
    window.app.showToast(`⚙️ Shredder Motor Speed adjusted to ${this.shredderRpm} RPM`, 'info');
  }

  generateEsgReport() {
    const store = window.db.get();
    let totalKg = 0;
    let totalCo2 = 0;
    store.pickups.forEach(p => {
      totalKg += p.weightKg || 0;
      totalCo2 += p.co2Offset || 0;
    });

    const windowRef = window.open('', '_blank', 'width=800,height=900');
    windowRef.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Sanjay Textiles ESG Sustainability Audit Report</title>
        <style>
          body { font-family: sans-serif; padding: 40px; color: #1e293b; line-height: 1.6; }
          h1 { color: #059669; border-bottom: 2px solid #10b981; padding-bottom: 10px; }
          .stat-box { background: #f0fdf4; border: 1px solid #bbf7d0; padding: 15px; margin: 15px 0; border-radius: 8px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #cbd5e1; padding: 10px; text-align: left; }
          th { background: #f1f5f9; }
        </style>
      </head>
      <body>
        <h1>🌱 Sanjay Textiles - ESG Waste & Carbon Audit</h1>
        <p><strong>Generated Date:</strong> ${new Date().toLocaleDateString()}</p>
        <p><strong>Facility Jurisdiction:</strong> Sanjay Textiles Central Fiber Recovery Hub</p>
        
        <div class="stat-box">
          <h2>Summary Metrics</h2>
          <p><strong>Total Textile Waste Diverted:</strong> ${(totalKg/1000).toFixed(2)} Metric Tons (${totalKg} kg)</p>
          <p><strong>Net CO₂ Emissions Offset:</strong> ${(totalCo2/1000).toFixed(2)} Metric Tons</p>
          <p><strong>Total Water Conserved:</strong> ${(totalKg * 10).toLocaleString()} Liters</p>
        </div>

        <h2>Batch Processing Breakdown</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>QR Code</th>
              <th>Donor</th>
              <th>Fabric Type</th>
              <th>Weight (kg)</th>
              <th>Status Stream</th>
            </tr>
          </thead>
          <tbody>
            ${store.pickups.map(p => `
              <tr>
                <td>${p.id}</td>
                <td>${p.qrCode || 'ST-QR-100'}</td>
                <td>${p.userName}</td>
                <td>${p.fabricType}</td>
                <td>${p.weightKg}</td>
                <td>${p.status}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <br/>
        <button onclick="window.print()" style="padding: 10px 20px; background: #059669; color: white; border: none; cursor: pointer; border-radius: 5px;">Print / Save as PDF</button>
      </body>
      </html>
    `);
  }
}

window.adminMgr = new AdminDashboardManager();
