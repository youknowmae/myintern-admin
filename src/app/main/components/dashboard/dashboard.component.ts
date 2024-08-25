import { Component, AfterViewInit } from '@angular/core';
import { Chart, ChartConfiguration, registerables, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { channel } from 'diagnostics_channel';

// Register all necessary components
Chart.register(...registerables);
Chart.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements AfterViewInit {

  pieChart: any;
  barChart: any;
  ojtBarChart: any;

  public config: ChartConfiguration<'pie'> = {
    type: 'pie',
    data: {
      labels: ['BSIT', 'BSCS', 'BSEMC', 'ACT'],
      datasets: [{
        data: [30, 25, 20, 25],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          position: 'top',
        },
        tooltip: {
          enabled: true,
        }
      }
    }
  };

  public barConfig: ChartConfiguration<'bar'> = {
    type: 'bar',
    data: {
      labels: ['BSIT', 'BSCS', 'BSEMC', 'ACT'],
      datasets: [
        {
          label: 'Pending',
          data: [5, 10, 7, 12],
          backgroundColor: '#FABC3F'
        },
        {
          label: 'Completed',
          data: [10, 15, 12, 7],
          backgroundColor: '#7C93C3'
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          position: 'top',
        },
        tooltip: {
          enabled: true,
        }
      },
      scales: {
        x: {
          stacked: true
        },
        y: {
          stacked: true
        }
      }
    }
  };

  public ojtBarConfig: ChartConfiguration<'bar'> = {
    type: 'bar',
    data: {
      labels: ['BSIT', 'BSCS', 'BSEMC', 'ACT'],
      datasets: [
        {
          label: 'Pending',
          data: [3, 7, 4, 6],
          backgroundColor: '#FABC3F'
        },
        {
          label: 'Completed',
          data: [12, 9, 15, 10],
          backgroundColor: '#7C93C3'
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          position: 'top',
        },
        tooltip: {
          enabled: true,
        }
      },
      scales: {
        x: {
          stacked: true
        },
        y: {
          stacked: true
        }
      }
    }
  };

  constructor() { }

  ngAfterViewInit(): void {
    this.pieChart = new Chart('pieChart', this.config);
    this.barChart = new Chart('barChart', this.barConfig);
    this.ojtBarChart = new Chart('ojtBarChart', this.ojtBarConfig);
  }
}
