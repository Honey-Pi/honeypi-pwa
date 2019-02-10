import {Component, OnInit} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {LocalStorage} from 'ngx-store';
import {MessagingService} from './services/messaging.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    public message;

    constructor(
        private router: Router,
        private messagingService: MessagingService
    ) { }

    @LocalStorage() private latestPath: string = null;

    ngOnInit(): void {
        /*
        Remember Page to navigate back
         */
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

        /*
        Register Notification-Service
         */
        const broadcastChannel = 595959;
        this.messagingService.requestPermission(broadcastChannel);
        this.messagingService.receiveMessage();
        this.message = this.messagingService.currentMessage;

        /* Add2Homescreen Event */
        let deferredPrompt;

        window.addEventListener('beforeinstallprompt', (e) => {
            // Prevent Chrome 67 and earlier from automatically showing the prompt
            e.preventDefault();
            // Stash the event so it can be triggered later.
            deferredPrompt = e;
        });


    }

}
