import { Component, Input, ViewEncapsulation, inject } from '@angular/core';

@Component({
  standalone: true,
  selector: '.app-logo-loader',
  template: `<span class="cursor-hand text-nowrap">{{text}}</span>`,
  // (click)="headerService.onClickLogo()"
  imports: [],
  encapsulation: ViewEncapsulation.None
})
export class AppLogoLoaderComponent {

  //protected headerService = inject(HeaderService);

  @Input() public text: string = '';
}
