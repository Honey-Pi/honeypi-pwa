import { Component, OnInit } from '@angular/core';

import {LocalStorage, WebstorableArray} from 'ngx-store';
import {BackendService} from '../../services/backend.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  constructor(public backendService: BackendService) { }

  sensorList: string[] = this.backendService.getTsFieldTitles();

  ngOnInit() {
  }

}
