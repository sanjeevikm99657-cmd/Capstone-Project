/* ==========================================================================
   EcoWeave - Interactive Chart Manager (Chart.js Integration)
   ========================================================================== */

class ChartManager {
  constructor() {
    this.userChart = null;
    this.adminMonthlyChart = null;
    this.adminStreamChart = null;
  }

  initUserImpactChart(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    if (this.userChart) {
      this.userChart.destroy();
    }

    const ctx = canvas.getContext('2d');
    this.userChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Cotton & Blends', 'Denim Garments', 'Synthetic Polyester', 'Pure Silk & Wool', 'Mixed Scraps'],
        datasets: [{
          data: [42, 28, 18, 7, 5],
          backgroundColor: [
            '#10b981',
            '#6366f1',
            '#06b6d4',
            '#ec4899',
            '#f97316'
          ],
          borderColor: '#0b0f19',
          borderWidth: 3,
          hoverOffset: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#94a3b8',
              font: { family: 'Plus Jakarta Sans', size: 12 },
              padding: 15
            }
          }
        },
        cutout: '70%'
      }
    });
  }

  initAdminDashboardCharts() {
    // 1. Monthly Waste Processing Trend Chart
    const monthlyCanvas = document.getElementById('adminMonthlyChart');
    if (monthlyCanvas) {
      if (this.adminMonthlyChart) this.adminMonthlyChart.destroy();
      const ctx1 = monthlyCanvas.getContext('2d');

      const gradientGreen = ctx1.createLinearGradient(0, 0, 0, 300);
      gradientGreen.addColorStop(0, 'rgba(16, 185, 129, 0.5)');
      gradientGreen.addColorStop(1, 'rgba(16, 185, 129, 0.0)');

      this.adminMonthlyChart = new Chart(ctx1, {
        type: 'line',
        data: {
          labels: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
          datasets: [{
            label: 'Waste Collected (Tons)',
            data: [12.4, 18.2, 24.8, 31.0, 42.5, 58.0],
            borderColor: '#10b981',
            backgroundColor: gradientGreen,
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#10b981',
            pointRadius: 5
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            x: {
              grid: { color: 'rgba(255, 255, 255, 0.05)' },
              ticks: { color: '#94a3b8' }
            },
            y: {
              grid: { color: 'rgba(255, 255, 255, 0.05)' },
              ticks: { color: '#94a3b8' }
            }
          }
        }
      });
    }

    // 2. Recycling Stream Allocation Doughnut Chart
    const streamCanvas = document.getElementById('adminStreamChart');
    if (streamCanvas) {
      if (this.adminStreamChart) this.adminStreamChart.destroy();
      const ctx2 = streamCanvas.getContext('2d');

      this.adminStreamChart = new Chart(ctx2, {
        type: 'doughnut',
        data: {
          labels: ['Direct Charity Donation', 'Upcycled Artisan Goods', 'Mechanical Fiber Shredding', 'Chemical Fiber Extraction'],
          datasets: [{
            data: [35, 25, 25, 15],
            backgroundColor: [
              '#10b981',
              '#6366f1',
              '#f97316',
              '#a855f7'
            ],
            borderColor: '#0b0f19',
            borderWidth: 3
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                color: '#94a3b8',
                font: { family: 'Plus Jakarta Sans', size: 11 },
                padding: 12
              }
            }
          },
          cutout: '65%'
        }
      });
    }
  }
}

window.chartMgr = new ChartManager();
