import { Component, Input, ViewEncapsulation, inject } from '@angular/core';
import { NgClass } from '@angular/common';

import { AppLogoLoaderComponent } from './app-logo-loader.component';

@Component({
  standalone: true,
  selector: 'app-logo',
  templateUrl: './app-logo.component.html',
  imports: [NgClass, AppLogoLoaderComponent],
  encapsulation: ViewEncapsulation.None,
})
export class AppLogoComponent {
  protected get title(): string {
    if (this.minimal) {
      return `Logo`;
    }

    return `Almas-Gallery Logo`;
  }

  protected get alternativeText(): string {
    if (this.minimal) {
      return `Logo`;
    }

    return `Almas-Gallery Logo`;
  }

  @Input({ required: true }) public minimal: boolean = false;
  @Input() public cssClass: string = '';

  protected imageSource: string = 'assets/images/logo-transparent.png';
  protected loadLogoImage: boolean = true;

  protected onLoadLogoError = () => {
    this.loadLogoImage = false;
  }
}
