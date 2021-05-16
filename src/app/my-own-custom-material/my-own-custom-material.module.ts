import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import {NgModule} from '@angular/core';

@NgModule({
  imports: [MatSliderModule, MatSlideToggleModule, MatIconModule, MatChipsModule, MatCardModule, MatProgressSpinnerModule, MatButtonModule, MatCheckboxModule, MatInputModule, MatBadgeModule, MatRadioModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule],
  exports: [MatSliderModule, MatSlideToggleModule, MatIconModule, MatChipsModule, MatCardModule, MatProgressSpinnerModule, MatButtonModule, MatCheckboxModule, MatInputModule, MatBadgeModule, MatRadioModule, MatSelectModule, MatDatepickerModule],
  providers: [MatDatepickerModule]
})
export class MyOwnCustomMaterialModule { }
