import { Component, OnInit } from '@angular/core';
import {BackendService} from '../../services/backend.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {

  constructor(private backendService: BackendService) { }

  get getData() {
    if (this.backendService.importSrc === 0) {
      return this.getDataTs();
    } else {
      return this.getDataCsv();
    }
  }

  // lineChart
  public lineChartData: Array<any> = this.getTsLineChartData();
  public lineChartLabels: Array<any> = this.getDataTsTimeLabels();
  public lineChartOptions: any = {
    responsive: true,
    scales: {
      xAxes: [{
        type: 'time',
        distribution: 'series',
        ticks: {
          source: 'labels'
        }
      }]
    }
  };
  public lineChartColors: Array<any> = this.getLineChartColors();
  public lineChartLegend = true;
  public lineChartType = 'line';
  /*
  Dygraph
   */
  // data property needs to be defined as attribute in the component and in native array format http://dygraphs.com/data.html#array
  public data = this.getTsDataForDygraph();
    // [[new Date('2008/05/07'), 75, 25],[new Date('2008/05/08'), 70, 30],[new Date('2008/05/09'), 80, 23]];
  getTsFieldTitlesForDygraph() {
    const labels = this.backendService.getTsFieldTitles();
    labels.unshift('Uhrzeit');
    return labels;
  }
  // options object needs to be defined as attribute in the component and consist of valid options http://dygraphs.com/options.html
  public options = {
    width: 'auto',
    pointSize: 4,
    connectSeparatedPoints: true,
    labels: this.getTsFieldTitlesForDygraph(),
    axes: {
      y: {
        // valueRange: [40, 80] Feste Werte
      }
    },
    showRangeSelector: true,
    rangeSelectorHeight: 20,
    rangeSelectorPlotStrokeColor: 'black',
    rangeSelectorPlotFillColor: 'grey',
    displayAnnotations: true,
    animatedZooms: false,
    rollPeriod: 1,              // Standard Mittelwert
    showRoller: false,           // Anzeigen zum ändern
    labelsSeparateLines: true,  // Beschriftung der Linien je in einer separaten Zeile anzeigen
    labelsDivStyles: {         // Labels in Kasten anzeigen
      'backgroundColor': 'rgba(200, 200, 255, 0.75)',
      'padding': '4px',
      'border': '1px solid black',
      'borderRadius': '10px',
      'boxShadow': '4px 4px 4px #888'  },
    drawPoints: false,           // Zeigt Punkte an
    colors: this.backendService.sensorSettings.colors,
    visibility: this.backendService.sensorSettings.visibility,
    displayAnnotations: true,
    xlabel: 'Uhrzeit',
    labelsDivStyles: {
      'text-align': 'right',
      'background': 'none'
    },
    strokeWidth: 1,     // Strichstärke
  };

  static hexToRGB(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16),
      g = parseInt(hex.slice(3, 5), 16),
      b = parseInt(hex.slice(5, 7), 16);

    if (alpha) {
      return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')';
    } else {
      return 'rgb(' + r + ', ' + g + ', ' + b + ')';
    }
  }

  getTsDataForDygraph() {
    const rows = [];
    for (const feed of this.backendService.tsData.feeds) {
      const row: any[] = [<Date>new Date(feed.created_at)];
      for (const field in feed) {
        if (field.indexOf('field') !== -1) {
          row.push(<number>parseFloat(feed[field]));
        }
      }
      rows.push(row);
    }
    return rows;
  }

  get tsDataLastLine() {
    const lastFeed = this.backendService.tsData.feeds.slice(-1)[0];
    const measurements = [];
    for (const field in lastFeed) {
      if (field.indexOf('field') !== -1) {
        measurements.push(<number>parseFloat(lastFeed[field]));
      }
    }
    return {time: new Date(lastFeed.created_at), fields: measurements};
  }

  getLineChartColors() {
    const row = [];
    for (let i = 0; i < this.backendService.getTsFieldTitles().length; i++) {
      row.push({
        backgroundColor: ViewComponent.hexToRGB(this.backendService.sensorSettings.colors[i], 0.2),
        borderColor: ViewComponent.hexToRGB(this.backendService.sensorSettings.colors[i], 1),
        pointBackgroundColor: ViewComponent.hexToRGB(this.backendService.sensorSettings.colors[i], 1),
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: ViewComponent.hexToRGB(this.backendService.sensorSettings.colors[i], 0.8)
      });
    }
    return row;
  }

  ngOnInit() {
  }

  getDataTs() {
    return this.backendService.tsData.feeds;
  }

  getDataTsTimeLabels() {
    const labels: Array<Date> = [];
    for (const feed of this.getDataTs()) {
      labels.push(feed.created_at);
    }
    return labels;
  }

  getDataTsPerField(fieldNumber: number) {
    const labels: Array<Date> = [];
    for (const feed of this.getDataTs()) {
      labels.push(feed['field' + fieldNumber]);
    }
    return labels;
  }

  getTsLineChartData() {
    const row = [];
    for (let i = 1; i <= 8; i++) {
      row.push({data: this.getDataTsPerField(i), label: this.backendService.getTsFieldTitle(i)});
    }
    return row;
  }

  getDataCsv() {
    return this.backendService.csvData;
  }

  // events
  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }

}
