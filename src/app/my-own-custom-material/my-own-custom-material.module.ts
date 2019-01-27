import {
  MatBadgeModule,
  MatButtonModule, MatCardModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatInputModule, MatNativeDateModule, MatProgressSpinnerModule,
  MatRadioModule,
  MatSelectModule
} from '@angular/material';
import {NgModule} from '@angular/core';

@NgModule({
  imports: [MatCardModule, MatProgressSpinnerModule, MatButtonModule, MatCheckboxModule, MatInputModule, MatBadgeModule, MatRadioModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule],
  exports: [MatCardModule, MatProgressSpinnerModule, MatButtonModule, MatCheckboxModule, MatInputModule, MatBadgeModule, MatRadioModule, MatSelectModule, MatDatepickerModule],
  providers: [MatDatepickerModule]
})
export class MyOwnCustomMaterialModule { }
