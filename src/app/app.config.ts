import { ApplicationConfig, provideZoneChangeDetection,importProvidersFrom,} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatNativeDateModule } from '@angular/material/core';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, NativeDateAdapter } from '@angular/material/core';



export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    importProvidersFrom(MatNativeDateModule),
    provideClientHydration(),
    provideHttpClient(withFetch()),
    provideMomentDateAdapter(),
    { provide: DateAdapter, useClass: NativeDateAdapter }
  ],
};
