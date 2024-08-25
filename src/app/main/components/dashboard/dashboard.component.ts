import { Component, AfterViewInit } from '@angular/core';
import { Chart, ChartConfiguration, registerables, ArcElement, Tooltip, Legend } from 'chart.js';


Chart.register(...registerables);


// Register necessary components
Chart.register(ArcElement, Tooltip, Legend);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements AfterViewInit {

  chart: any;

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

  constructor() { }

  ngAfterViewInit(): void {
    // Ensure the chart is created after the view is initialized
    this.chart = new Chart('chart', this.config);
  }
}
