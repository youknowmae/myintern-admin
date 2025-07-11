import { NgModule, isDevMode } from '@angular/core';
import {
  BrowserModule,
  provideClientHydration,
} from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { MainComponent } from './main/main.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { MatDialogModule } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';

import { LocationStrategy, HashLocationStrategy } from '@angular/common';

import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth';
import { PdfPreviewComponent } from './components/pdf-preview/pdf-preview.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { MaterialsModules } from './modules/materials.module';
import { ResponseInterceptor } from './interceptors/response.interceptor';
import { ApplicationStatusTextPipe } from './pipes/application-status-text.pipe';
import { ServiceWorkerModule } from '@angular/service-worker';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MainComponent,
    PdfPreviewComponent,
  ],
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatDialogModule,
    RouterModule,
    ReactiveFormsModule,
    NgxDocViewerModule,
    MaterialsModules,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
  ],
  providers: [
    provideClientHydration(),
    provideAnimationsAsync(),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ResponseInterceptor, multi: true },
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    provideHttpClient(withInterceptorsFromDi()),
  ],
})
export class AppModule {}
