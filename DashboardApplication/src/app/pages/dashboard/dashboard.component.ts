import { Component, ViewChild } from '@angular/core';
import { _BaseComponent } from '../_base.component';

import * as FrCard from '@fr-widget/sdk/card';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    FrCard.FrCardComponent,
    FrCard.FrCardHeaderComponent,
    FrCard.FrCardFooterComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent extends _BaseComponent { }
