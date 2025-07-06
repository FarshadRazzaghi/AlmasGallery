import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-navigation-route',
  templateUrl: './navigation-route.component.html',
  imports: [RouterOutlet],
})
export class NavigationRouteComponent { }
