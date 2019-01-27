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
    MatSelectModule
} from '@angular/material';
import {NgModule} from '@angular/core';

@NgModule({
  imports: [MatIconModule, MatChipsModule, MatCardModule, MatProgressSpinnerModule, MatButtonModule, MatCheckboxModule, MatInputModule, MatBadgeModule, MatRadioModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule],
  exports: [MatIconModule, MatChipsModule, MatCardModule, MatProgressSpinnerModule, MatButtonModule, MatCheckboxModule, MatInputModule, MatBadgeModule, MatRadioModule, MatSelectModule, MatDatepickerModule],
  providers: [MatDatepickerModule]
})
export class MyOwnCustomMaterialModule { }
