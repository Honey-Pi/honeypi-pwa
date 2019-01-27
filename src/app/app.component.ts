import {Component, OnInit} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {LocalStorage} from 'ngx-store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    constructor(
        private router: Router
    ) { }

    @LocalStorage() private latestPath: string = null;

    ngOnInit(): void {
        if (this.latestPath) {
            console.log('Stored url found', this.latestPath);
            this.router.navigate([this.latestPath]);
        }
        this.router.events
            .subscribe((event) => {
                if (event instanceof NavigationEnd) {
                    this.latestPath = event.url;
                    console.log('Url changed to', event.url);
                }
            });
    }

}
