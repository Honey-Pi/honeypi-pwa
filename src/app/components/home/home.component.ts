import { Component, OnInit } from '@angular/core';
import { BackendService } from '../../services/backend.service';
import { LocalStorage, SessionStorage } from 'ngx-store';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  @LocalStorage() public ts: any = {
    channel_id: 651397,
    api_key: 'QPAXQ8XI1Q0P6T11',
    start: null,
    end: null,
    results: null,
    timescale: 15
  };

  @LocalStorage() public csv: any = {
    seperator: ',',
    skip_first: true
  };

  constructor(public backendService: BackendService) { }

  ngOnInit() {
  }

  setTime(days: number, hours: number = 0) {
    const d: Date = new Date();
    d.setDate(d.getDate() - days);
    d.setHours(d.getHours() - hours);

    this.ts.end = null;
    this.ts.start = d;
    this.ts.save();
  }

  readTs() {
    this.backendService.readTsChannel(this.ts.channel_id, 'json', this.ts.api_key, this.ts.results, this.ts.start, this.ts.end, this.ts.timescale).subscribe(
      (val) => {
        this.backendService.tsData = val;
      },
      response => {
        this.backendService.tsData =  response;
      },
      () => {
        console.log('The readTsChannel observable is now completed.');
      });
  }

  readCsv(event) {
    const file: File = event.target.files[0];
    if (file) {
      const reader: FileReader = new FileReader();
      reader.readAsText(file, 'UTF-8');
      reader.onload = () => {
        const csv: string = <string>reader.result;
        if (csv) {
          if (window.confirm('Soll die CSV-Datei jetzt importiert werden?')) {
            console.log('CSV: ', csv.substring(0, 100) + '...');
            // convert text to json here
            this.backendService.csvData = this.csvJSON(csv);
            console.log(this.backendService.csvData);
          }
        }
      };
      reader.onerror = () => {
        window.alert('Error reading file.');
      };
    }
  }

  public csvJSON(csv: string) {
    const lines = csv.replace('\r', '').split('\n');
    const result = [];
    const headers = lines[0].split(this.csv.seperator);

    for (let i = 1; i < lines.length; i++) {

      const obj = {};
      const currentline = lines[i].replace('\r', '').split(this.csv.seperator);

      for (let j = 0; j < headers.length; j++) {
        obj[headers[j]] = currentline[j];
      }

      result.push(obj);

    }

    return result; // JavaScript object
  }
/*
  csv2Array(fileInput: any) {
    //read file from input
    this.fileReaded = fileInput.target.files[0];

    let reader: FileReader = new FileReader();
    reader.readAsText(this.fileReaded);

    reader.onload = (e) => {
      let csv: string = reader.result;
      let allTextLines = csv.split(/\r|\n|\r/);
      let headers = allTextLines[0].split(',');
      let lines = [];

      for (let i = 0; i < allTextLines.length; i++) {
        // split content based on comma
        let data = allTextLines[i].split(',');
        if (data.length === headers.length) {
          let tarr = [];
          for (let j = 0; j < headers.length; j++) {
            tarr.push(data[j]);
          }

          // log each row to see output
          console.log(tarr);
          lines.push(tarr);
        }
      }
      // all rows in the csv file
      console.log(">>>>>>>>>>>>>>>>>", lines);
    }
  }
*/
}
