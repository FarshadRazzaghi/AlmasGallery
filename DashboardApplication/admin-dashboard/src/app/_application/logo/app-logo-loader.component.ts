import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-logo-loader',
  template: `<span class="cursor-hand text-nowrap">{{text}}</span>`,
  imports: [],
  encapsulation: ViewEncapsulation.None
})
export class AppLogoLoaderComponent {

  @Input() public text: string;

  constructor() {
    this.text = '';
  }
}
