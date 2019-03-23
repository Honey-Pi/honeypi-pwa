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
                        console.error(response);
                        alert('Fehler beim Abruf der ThingSpeak Daten');
                    },
                    () => {
                        console.log('The readTsChannel observable is now completed.');
                        this.barButtonOptions.active = false;
                        this.barButtonOptions.text = '›› ThingSpeak abrufen';
                    });
    }

  readCsvFromFile(event) {
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
            this.backendService.csvData = this.backendService.csvJSON(csv);
            console.log(this.backendService.csvData);
          }
        }
      };
      reader.onerror = () => {
        window.alert('Error reading file.');
      };
    }
  }

  public readCsvFromUrl() {
    this.backendService.readCsvUrl().subscribe( (val) => {
            // convert text to json here
            this.backendService.csvData = this.backendService.csvJSON(val);
            console.log(this.backendService.csvData);
        },
        response => {
            console.error(response);
            alert('Fehler beim Abruf der CSV-URL.');
        },
        () => {
            console.log('The readCsvFromUrl observable is now completed.');
        });
  }

}
