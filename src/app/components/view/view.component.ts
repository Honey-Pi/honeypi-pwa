import { Component, OnInit } from '@angular/core';
import {BackendService} from '../../services/backend.service';
import {Router} from '@angular/router';
import {MatProgressButtonOptions} from 'mat-progress-buttons';
import {LocalStorage} from 'ngx-store';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {

    constructor(private backendService: BackendService, private router: Router) { }

    get getData() {
        if (this.backendService.importSrc === 0) {
            return this.getDataTs();
        } else {
            return this.getDataCsv();
        }
    }

    @LocalStorage() public showChart = true;
    @LocalStorage() public showDygraph = false;

    // lineChart
    public lineChartData: Array<any> = this.getTsLineChartData();
    public lineChartLabels: Array<any> = this.getDataTsTimeLabels();
    public lineChartOptions: any = {
      responsive: true,
      plugins: {
          datalabels: {
              backgroundColor: function(context) {
                  return context.dataset.backgroundColor;
              },
              borderRadius: 4,
              color: 'white',
              font: {
                  weight: 'bold'
              },
              formatter: Math.round,
              display: (context: any) => {
                  return context.dataIndex % 2; // display labels with an odd index
              },
          }
      },
      scales: {
          xAxes: [{
            type: 'time',
            distribution: 'linear',
            ticks: {
                source: 'labels',
                autoSkip: true,
                maxTicksLimit: 20
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
    // options object needs to be defined as attribute in the component and consist of valid options http://dygraphs.com/options.html
    public options = {
        width: 'auto',
        pointSize: 4,
        connectSeparatedPoints: true,
        labels: this.getTsFieldTitlesForDygraph(),
        showRangeSelector: true,
        rangeSelectorHeight: 20,
        rangeSelectorPlotStrokeColor: 'black',
        rangeSelectorPlotFillColor: 'grey',
        displayAnnotations: true,
        animatedZooms: false,
        rollPeriod: 1,
        showRoller: false,
        labelsSeparateLines: true,
        drawPoints: false,
        colors: this.backendService.sensorSettings.colors,
        visibility: this.backendService.sensorSettings.visibility,
        xlabel: 'Uhrzeit',
        labelsDivStyles: {
          'text-align': 'right',
          'background': 'none'
        },
        strokeWidth: 1,
    };

    /*
    Progress Button
     */
    barButtonOptions: MatProgressButtonOptions = {
        active: false,
        text: 'Update',
        buttonColor: 'accent',
        barColor: 'primary',
        raised: true,
        stroked: false,
        mode: 'indeterminate',
        value: 0,
        disabled: false
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

    ngOnInit() {
        if (!this.backendService.isDataLoaded) {
            this.router.navigate(['/home']);
        }
    }

    getTsFieldTitlesForDygraph() {
        const labels = this.backendService.getTsFieldTitles();
        labels.unshift('Uhrzeit');
        return labels;
    }

    getTsDataForDygraph() {
          // [[new Date('2008/05/07'), 75, 25],[new Date('2008/05/08'), 70, 30],[new Date('2008/05/09'), 80, 23]];
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
          labels.push(feed['field' + (fieldNumber + 1)]);
        }
        return labels;
    }

    getTsLineChartData() {
        const row = [];
        for (let i = 0; i < this.backendService.getTsFieldTitles().length; i++) {
          row.push({    data: this.getDataTsPerField(i),
                        label: this.backendService.getTsFieldTitle(i),
                        hidden: !this.backendService.sensorSettings.visibility[i]
          });
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

    updateTsData(): void {
        this.barButtonOptions.active = true;
        this.barButtonOptions.text = 'Update...';
        setTimeout(() => {
            this.barButtonOptions.active = false;
            this.barButtonOptions.text = 'Update';
        }, 3500);
    }

}
