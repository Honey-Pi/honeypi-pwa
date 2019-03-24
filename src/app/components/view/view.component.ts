import { Component, OnInit } from '@angular/core';
import {BackendService} from '../../services/backend.service';
import {Router} from '@angular/router';
import {MatProgressButtonOptions} from 'mat-progress-buttons';
import {LocalStorage} from 'ngx-store';
import * as moment from 'moment';
import {MessagingService} from '../../services/messaging.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {

    constructor(public backendService: BackendService,
                private router: Router,
                private messagingService: MessagingService) { }

    @LocalStorage() public showChart = true;
    @LocalStorage() public showDygraph = false;

    /*
    Chart.js lineChart
     */
    public lineChartData: Array<any> = (this.backendService.importSrc === 0) ? this.getTsLineChartData() : this.getCsvLineChartData();
    public lineChartLabels: Array<any> = (this.backendService.importSrc === 0) ? this.getDataTsTimeLabels() : this.getDataCsvTimeLabels();
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
                  // return context.dataIndex % 2; // display labels with an odd index
                  return false; // never display labels
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
    public dygraphData = (this.backendService.importSrc === 0) ? this.getTsDataForDygraph() : this.getCsvDataForDygraph();
    // options object needs to be defined as attribute in the component and consist of valid options http://dygraphs.com/options.html
    public dygraphOptions = {
        width: 'auto',
        pointSize: 4,
        connectSeparatedPoints: true,
        labels: (this.backendService.importSrc === 0) ? this.getTsFieldTitlesForDygraph() : this.getCsvFieldTitlesForDygraph(),
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

    static convertStringToDate(dateStr: string): Date {
        const momentDate: moment.Moment = moment(dateStr);
        return momentDate.toDate();
    }

    ngOnInit() {
        if (!this.backendService.isDataLoaded) {
            this.router.navigate(['/home']);
        } else {
            const channelId = this.backendService.importSettings.ts.channel_id;
            if (this.backendService.importSrc === 0 && channelId) {
                this.messagingService.requestPermission(channelId);
            }
        }
    }

    getLineChartColors() {
        const row = [];
        for (let i = 0; i < this.backendService.tsCountFields; i++) {
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

    getDataCsv() {
        return this.backendService.csvData;
    }

    get getData() {
        if (this.backendService.importSrc === 0) {
            return this.getDataTs();
        } else {
            return this.getDataCsv();
        }
    }

    getTsFieldTitlesForDygraph() {
        const labels = this.backendService.getTsFieldTitles();
        labels.unshift('Uhrzeit');
        return labels;
    }

    getCsvFieldTitlesForDygraph() {
        // needs to match with colums in json
        return ['Uhrzeit', 'A', 'B', 'C', 'D', 'E', 'F', 'G'];
    }

    getTsDataForDygraph() {
          // [[new Date('2008/05/07'), 75, 25],[new Date('2008/05/08'), 70, 30],[new Date('2008/05/09'), 80, 23]];
        const rows = [];
        for (const feed of this.getDataTs()) {
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

    getCsvDataForDygraph() {
        // [[new Date('2008/05/07'), 75, 25],[new Date('2008/05/08'), 70, 30],[new Date('2008/05/09'), 80, 23]];
        const rows = [];
        for (const line of this.getDataCsv()) {
            const row: any[] = [ViewComponent.convertStringToDate(line[this.backendService.importSettings.csv.dateIndex || 0])];
            for (let i = 0; i < this.backendService.tsCountFields; i++) {
                // skip Date index
                if (i !== this.backendService.importSettings.csv.dateIndex) {
                    if (line[i]) {
                        row.push(<number>parseFloat(line[i]));
                    }
                }
            }
            if (row.length > 1) {
             rows.push(row);
            }
        }
        return rows;
    }

    getDataTsTimeLabels() {
        const labels: Array<Date> = [];
        for (const feed of this.getDataTs()) {
          labels.push(ViewComponent.convertStringToDate(feed.created_at));
        }
        return labels;
    }

    getDataCsvTimeLabels() {
        const labels: Array<Date> = [];
        for (const feed of this.getDataCsv()) {
            if (feed && feed[this.backendService.importSettings.csv.dateIndex || 0]) {
                const newTimeLabel: Date = ViewComponent.convertStringToDate(feed[this.backendService.importSettings.csv.dateIndex || 0]);
                labels.push(newTimeLabel);
            }
        }
        return labels;
    }

    getDataTsPerField(fieldNumber: number) {
        const datas: Array<number> = [];
        for (const feed of this.getDataTs()) {
          datas.push(feed['field' + (fieldNumber + 1)]);
        }
        return datas;
    }

    getDataCsvPerField(index: number) {
        const datas: Array<number> = [];
        for (const feed of this.getDataCsv()) {
            datas.push(feed[index]);
        }
        return datas;
    }

    getTsLineChartData() {
        const row = [];
        for (let i = 0; i < this.backendService.tsCountFields; i++) {
          row.push({
                        data: this.getDataTsPerField(i),
                        label: this.backendService.getTsFieldTitle(i),
                        hidden: !this.backendService.sensorSettings.visibility[i]
                    });
        }
        return row;
    }

    getCsvLineChartData() {
        const row = [];
        for (let i = 0; i < this.backendService.tsCountFields; i++) {
            // skip first line with Date
            if (i !== this.backendService.importSettings.csv.dateIndex) {
                row.push({
                    data: this.getDataCsvPerField(i),
                    label: i + 1,
                    hidden: !this.backendService.sensorSettings.visibility[i]
                });
            }
        }
        return row;
    }

    // chart.js events
    public chartClicked(e: any): void {
        console.log(e);
    }

    public chartHovered(e: any): void {
        console.log(e);
    }

    /*
    Update
     */
    get showUpdateButton(): boolean {
        return (this.backendService.importSrc === 0) ||
            (this.backendService.importSrc === 1 && !this.backendService.importSettings.csv.useFile);
    }

    updateTsData(): void {
        this.barButtonOptions.active = true;
        this.barButtonOptions.text = 'Update...';

        this.backendService.readTsChannel()
            .subscribe( (val) => {
                    this.backendService.tsData = val;
                },
                response => {
                    this.backendService.tsData =  response;
                },
                () => {
                    console.log('The readTsChannel observable is now completed.');
                    this.barButtonOptions.active = false;
                    this.barButtonOptions.text = 'Update';
                });
    }

    updateCsvData() {
        this.barButtonOptions.active = true;
        this.barButtonOptions.text = 'Update...';

        this.backendService.readCsvUrl().subscribe( (val) => {
                // convert text to json here
                this.backendService.csvData = this.backendService.csvJSON(val);
                console.log(this.backendService.csvData);
            },
            response => {
                console.log(response);
                alert('Fehler beim Abruf der CSV-URL.');
            },
            () => {
                console.log('The readCsvUrl observable is now completed.');

                this.barButtonOptions.active = false;
                this.barButtonOptions.text = 'Update';
            });
    }

}
