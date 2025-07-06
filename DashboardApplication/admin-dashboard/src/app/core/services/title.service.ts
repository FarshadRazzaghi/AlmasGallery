import { inject, Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { filter } from 'rxjs';
import { RoutingService } from './routing.service';

@Injectable({ providedIn: 'root' })
export class TitleService {

  private prefix = "الماس گالری";

  private readonly router = inject(Router);
  private readonly title = inject(Title);
  private readonly routingService = inject(RoutingService);

  public init(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        const url = this.router.url.split('?')[0].split('#')[0];
        const matched = this.routingService.findNavigationNodeByPath(url, this.routingService.navigationGroup);

        const label = matched?.data?.label ?? 'Not Found';
        const formatted = this.toTitle(label);

        this.title.setTitle(`${this.prefix} | ${formatted}`);
      });
  }

  public set(title: string): void {
    this.title.setTitle(`${this.prefix} | ${title}`);
  }

  private toTitle(str: string): string {
    return str
      .replace(/([A-Z])/g, ' $1')
      .replace(/-/g, ' ')
      .replace(/\s+/g, ' ')
      .replace(/^\w/, c => c.toUpperCase())
      .trim();
  }
}
