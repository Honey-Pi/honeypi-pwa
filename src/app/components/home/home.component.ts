import { Component, OnInit } from '@angular/core';
import { BackendService } from '../../services/backend.service';
import { LocalStorage, SessionStorage } from 'ngx-store';
import {MatProgressButtonOptions} from 'mat-progress-buttons';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    /*
      Progress Button
    */
    barButtonOptions: MatProgressButtonOptions = {
        active: false,
        text: '›› ThingSpeak abrufen',
        buttonColor: 'primary',
        barColor: 'accent',
        raised: true,
        stroked: false,
        mode: 'indeterminate',
        value: 0,
        disabled: false
    };
    /*
        Results Slider
     */
    formatLabel(value: number | null) {
        if (!value) {
            return 0;
        }

        if (value >= 1000) {
            return Math.round(value / 10) + '0';
        }

        return value;
    }

    constructor(public backendService: BackendService) { }

    ngOnInit() {
    }

    public get tsSettings() {
        return this.backendService.importSettings.ts;
    }

    public saveSettings(): void {
        // save to localStorage
        this.backendService.importSettings = this.backendService.importSettings;
    }

    public get csvSettings() {
        return this.backendService.importSettings.csv;
    }

    setTime(days: number, hours: number = 0) {
        const d: Date = new Date();
        d.setDate(d.getDate() - days);
        d.setHours(d.getHours() - hours);

        this.tsSettings.end = null;
        this.tsSettings.start = d;
        this.saveSettings();
    }

    readTs() {
        this.barButtonOptions.active = true;
        this.barButtonOptions.text = 'Lädt ThingSpeak...';

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
                        this.barButtonOptions.text = '›› ThingSpeak abrufen';
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
    const headers = lines[0].split(this.csvSettings.seperator);

    for (let i = 1; i < lines.length; i++) {

      const obj = {};
      const currentline = lines[i].replace('\r', '').split(this.csvSettings.seperator);

      for (let j = 0; j < headers.length; j++) {
        obj[headers[j]] = currentline[j];
      }

      result.push(obj);

    }

    return result; // JavaScript object
  }

  public readCsvFromUrlAndParse() {
    this.backendService.readCsvFromUrl().subscribe(data => {
        // convert text to json here
        this.backendService.csvData = this.csvJSON(data);
        console.log(this.backendService.csvData);
    });
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
