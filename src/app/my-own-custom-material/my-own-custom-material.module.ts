import {
    MatBadgeModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatIconModule,
    MatInputModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSelectModule,
    MatSlideToggleModule
} from '@angular/material';
import {NgModule} from '@angular/core';

@NgModule({
  imports: [MatSlideToggleModule, MatIconModule, MatChipsModule, MatCardModule, MatProgressSpinnerModule, MatButtonModule, MatCheckboxModule, MatInputModule, MatBadgeModule, MatRadioModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule],
  exports: [MatSlideToggleModule, MatIconModule, MatChipsModule, MatCardModule, MatProgressSpinnerModule, MatButtonModule, MatCheckboxModule, MatInputModule, MatBadgeModule, MatRadioModule, MatSelectModule, MatDatepickerModule],
  providers: [MatDatepickerModule]
})
export class MyOwnCustomMaterialModule { }
