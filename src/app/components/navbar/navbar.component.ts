import { Component, OnInit } from '@angular/core';
import {BackendService} from '../../services/backend.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(private backendService: BackendService) { }

  ngOnInit() {
  }

  get isDisabled() {
    return !this.backendService.isDataLoaded;
  }

}
