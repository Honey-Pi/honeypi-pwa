import { Component, OnInit } from '@angular/core';

import {BackendService} from '../../services/backend.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  constructor(public backendService: BackendService, private router: Router) { }

  sensorList: string[] = this.backendService.getTsFieldTitles();

  ngOnInit() {
      if (!this.backendService.isDataLoaded) {
          this.router.navigate(['/home']);
      }
  }

}
