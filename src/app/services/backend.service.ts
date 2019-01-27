import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {LocalStorage} from 'ngx-store';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

    private tsApiUrl = 'https://api.thingspeak.com';

    private tsCountFields = 8;

    @LocalStorage() public importSrc = 0;
    @LocalStorage() public tsData: any = null;
    @LocalStorage() public csvData: any = null;
    @LocalStorage() sensorSettings = {
        colors: BackendService.initRandomColors(this.tsCountFields),
        visibility: BackendService.initVisibleFields(this.tsCountFields),
        units: []
    };

    public unitList = ['°C', 'K', '°F', 'mbar', 'kg', 'AQI', 'mm', '%', 'V'];

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

  public readTsChannel(channel_id: number,
                       format: string = 'json',
                       api_key: string,
                       results: number,
                       start: Date,
                       end: Date): Observable<Object> {
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

    return this.http.get(this.tsApiUrl + '/channels/' + channel_id + '/feeds.' + format + append);
  }

  getTsFieldTitle(fieldNumber: number) {
    return this.tsData.channel['field' + (fieldNumber + 1)];
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


}
