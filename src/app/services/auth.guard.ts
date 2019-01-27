import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import { Observable } from 'rxjs';
import {BackendService} from './backend.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(
        private router: Router,
        private backendService: BackendService
    ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    if (this.backendService.isDataLoaded) {
        return true;
    } else {
        console.log('No Data loaded => navigating to home');
        this.router.navigate(['/home']);
        return false;
    }
  }
}
