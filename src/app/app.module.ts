import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {HttpClientModule} from '@angular/common/http';
import { NavbarComponent } from './components/navbar/navbar.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MyOwnCustomMaterialModule} from './my-own-custom-material/my-own-custom-material.module';
import { HomeComponent } from './components/home/home.component';
import {RouterModule, Routes} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ViewComponent } from './components/view/view.component';
import { SettingsComponent } from './components/settings/settings.component';
import {FooterComponent} from './components/footer/footer.component';

import {WebStorageModule} from 'ngx-store';
import {ChartsModule} from 'ng2-charts';
import {NgxDygraphsModule} from 'ngx-dygraphs';
import { ColorPickerModule } from 'ngx-color-picker';
import '../../node_modules/chartjs-plugin-datalabels/dist/chartjs-plugin-datalabels.js';
import {MatProgressButtonsModule} from 'mat-progress-buttons';
import {AuthGuard} from './services/auth.guard';
// FCM
import {environment} from '../environments/environment';
import {AngularFireMessagingModule} from '@angular/fire/messaging';
import {AngularFireModule} from '@angular/fire';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {MessagingService} from './services/messaging.service';
import {AngularFireDatabaseModule} from '@angular/fire/database';


const appRoutes: Routes = [
  { path: 'home', component: HomeComponent, pathMatch: 'full' },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'view', component: ViewComponent, canActivate: [AuthGuard] },
  { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard] },
  { path: '**', component: HomeComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    ViewComponent,
    SettingsComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes, { relativeLinkResolution: 'legacy' }),
    HttpClientModule,
    BrowserAnimationsModule,
    MyOwnCustomMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    ChartsModule,
    NgxDygraphsModule,
    ColorPickerModule,
    MatProgressButtonsModule.forRoot(),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFireMessagingModule,
    AngularFireModule.initializeApp(environment.firebase),
    WebStorageModule.forRoot(),
  ],
  providers: [MessagingService, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
