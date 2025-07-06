import { Component } from '@angular/core';
import { FrCardComponent } from '@fr-widget/sdk/card';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  imports: [FrCardComponent],
})
export class DashboardComponent { }
