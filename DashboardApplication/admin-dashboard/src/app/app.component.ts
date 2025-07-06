import { Component, AfterViewInit, AfterViewChecked } from '@angular/core';
import { Router, RouterOutlet, Routes } from '@angular/router';
import { RoutingService, TitleService } from '@core/services';
import { environment } from '@environments/environment'

@Component({
  standalone: true,
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
  imports: [RouterOutlet]
})
export class AppComponent implements AfterViewInit, AfterViewChecked {

  constructor(
    private router: Router,
    private titleService: TitleService,
    private routingService: RoutingService
  ) { }

  ngAfterViewChecked(): void {
    const currentConfig = this.router.config;
    const dynamicRoutes: Routes = this.routingService.generateRoutes(this.routingService.navigationGroup);

    const dashboardRoute = currentConfig.find(route => route.path === environment.dashboard);
    if (dashboardRoute) {
      dashboardRoute.children = dynamicRoutes;
    }

    this.router.resetConfig(currentConfig);
  }

  ngAfterViewInit(): void {
    this.titleService.init();
  }
}
