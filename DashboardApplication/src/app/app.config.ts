import { ApplicationConfig, ErrorHandler } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';

import { AppRoutes } from './helper/app.routes';
import { CustomErrorHandler } from './error.handler';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(AppRoutes),
    provideClientHydration(),
    provideHttpClient(),
    provideAnimationsAsync(),
    {
      provide: ErrorHandler,
      useClass: CustomErrorHandler
    },
  ]
}
