import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {LocalStorage} from 'ngx-store';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

    private bypassCorsUrl = 'https://www.honey-pi.de/backend/getcsv.php';
    private tsApiUrl = 'https://api.thingspeak.com';
    public tsCountFields = 8;
    public seperators: string[] = [',', '|', '/', ';', '^', '~'];
    public unitList = ['°C', 'K', '°F', 'mbar', 'kg', 'AQI', 'mm', '%', 'V'];

    @LocalStorage() public selectedSetting = 0;
    @LocalStorage() public importSettings = {
        csv: {
            seperator: ',',
            noHeaders: true,
            useFile: false,
            urlPath: 'https://live.beelogger.de/beelogger/beelogger.csv',
            dateIndex: 0
        },
        ts: {
            channel_id: 651397,
            public: true,
            api_key: 'QPAXQ8XI1Q0P6T11',
            start: null,
            end: null,
            results: 8000,
            timescale: 15,
            results_min: 10,
            results_max: 8000
        }
    };
    @LocalStorage() public importSrc = 0;
    @LocalStorage() public tsData: any = null;
    @LocalStorage() public csvData: any = null;
    @LocalStorage() sensorSettings = {
                                        colors: BackendService.initRandomColors(this.tsCountFields),
                                        visibility: BackendService.initVisibleFields(this.tsCountFields),
                                        units: []
                                    };

    static initRandomColors(count = 8) {
        const colors: string[] = [];
        for (let i = 0; i < count; i++) {
          colors.push('#' + (Math.random() * 0xFFFFFF << 0).toString(16));
        }
        return colors;
    }

    static initVisibleFields(count = 8) {
        const fields: boolean[] = [];
        for (let i = 0; i < count; i++) {
            fields.push(true);
        }
        return fields;
    }

    constructor(private http: HttpClient) { }

    public csvJSON(csv: string) {
        const lines = csv.replace('\r', '').split('\n');
        const result = [];
        const headers = lines[0].split(this.importSettings.csv.seperator);
        const firstIndex = (this.importSettings.csv.noHeaders) ? 0 : 1;
        for (let i = firstIndex; i < lines.length; i++) {

            const obj = {};
            const currentLine = lines[i].replace('\r', '').split(this.importSettings.csv.seperator);

            for (let j = 0; j < headers.length; j++) {
                if (this.importSettings.csv.noHeaders) {
                    obj[j] = currentLine[j];
                } else {
                    obj[headers[j]] = currentLine[j];
                }
            }
            result.push(obj);
        }

        return result; // JavaScript object
    }

    get isDataLoaded(): boolean {
        return ((this.importSrc === 0 && this.tsData) || (this.importSrc === 1 && this.csvData));
    }

    public readTsChannel(): Observable<Object> {

        const channel_id = this.importSettings.ts.channel_id;
        const format = 'json';
        const api_key = (!this.importSettings.ts.public) ? this.importSettings.ts.api_key : null;
        const results = this.importSettings.ts.results;
        const start = this.importSettings.ts.start;
        const end = this.importSettings.ts.end;
        const timescale = this.importSettings.ts.timescale;

        let append = '?';
        if (api_key) {
          append += 'api_key=' + api_key;
        }
        if (start) {
          append += '&start=' + start;
        }
        if (end) {
          append += '&end=' + end;
        }
        append += '&timezone=Europe/Berlin';
        if (results) {
          append += '&results=' + results;
        }
        if (timescale) {
          append += '&timescale=' + timescale;
        }

        return this.http.get(this.tsApiUrl + '/channels/' + channel_id + '/feeds.' + format + append);
    }

    getTsFieldTitle(fieldNumber: number) {
        return this.tsData.channel['field' + (fieldNumber + 1)];
    }

    getTsFieldTitles(filter = false) {
        const row = [];
        for (let i = 0; i < this.tsCountFields; i++) {
          if (filter) {
            if (this.sensorSettings.visibility[i] && this.tsDataLastLine.fields[i]) {
                row.push(this.getTsFieldTitle(i));
            }
          } else {
            row.push(this.getTsFieldTitle(i));
          }
        }
        return row;
    }

    get tsDataLastLine() {
        const lastFeed = this.tsData.feeds.slice(-1)[0];
        const measurements = [];
        for (const field in lastFeed) {
            if (field.indexOf('field') !== -1) {
                measurements.push(<number>parseFloat(lastFeed[field]));
            }
        }
        return {time: new Date(lastFeed.created_at), fields: measurements};
    }

    getTsFieldForMeasurementView(): {title, visibility, data, unit}[] {
        const row = [];
        for (let i = 0; i < this.tsCountFields; i++) {
            if (this.sensorSettings.visibility[i] && this.tsDataLastLine.fields[i]) {
                row.push({
                    title: this.getTsFieldTitle(i),
                    visibility: this.sensorSettings.visibility[i],
                    data: this.tsDataLastLine.fields[i],
                    unit: this.sensorSettings.units[i]
                });
            }
        }
        return row;
    }

    public readCsvUrl() {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type':  'application/x-www-form-urlencoded'
            }),
            responseType: 'text' as 'json'
        };
        const postBody = 'file=' + this.importSettings.csv.urlPath;
        return this.http.post<string>(this.bypassCorsUrl, postBody, httpOptions);
    }

}
