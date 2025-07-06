/// <reference types="@angular/localize" />

import { bootstrapApplication, provideClientHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';

import { AppRoutes } from './app/app-routing.module';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(AppRoutes),
    provideClientHydration(),
    provideHttpClient(withFetch()),
    provideAnimations(),
  ]
}).catch(err => console.error(err));
