import { Injectable } from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {HttpClient, HttpEventType, HttpRequest, HttpResponse} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {LocalStorage} from 'ngx-store';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  private tsApiUrl = 'https://api.thingspeak.com';

  @LocalStorage() public importSrc = 0;
  @LocalStorage() public tsData: any = null;
  @LocalStorage() public csvData: any = null;
  @LocalStorage() sensorSettings = {
    colors: BackendService.initRandomColors(8),
    visibility: [],
    units: []
  };

  public unitList = ['°C', 'K', '°F', 'mbar', 'kg', 'AQI', 'mm', '%', 'V'];

  static initRandomColors(count: number) {
    const colors: string[] = [];
    for (let i = 0; i < count; i++) {
      colors.push('#' + (Math.random() * 0xFFFFFF << 0).toString(16));
    }
    return colors;
  }

  constructor(private http: HttpClient) { }

  public saveUser(newUser: any): Observable<Object> {
    return this.http.post(environment.apiURL + '/users', newUser);
  }

  public readTsChannel(channel_id: number,
                       format?: string = 'json',
                       api_key?: string,
                       results?: number,
                       start?: Date,
                       end?: Date): Observable<Object> {
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
    return this.tsData.channel['field' + fieldNumber];
  }

  getTsFieldTitles() {
    const row = [];
    for (let i = 1; i <= 8; i++) {
      row.push(this.getTsFieldTitle(i));
    }
    return row;
  }


}
