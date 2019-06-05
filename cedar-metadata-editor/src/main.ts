import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import 'hammerjs';


declare global {
  interface Window {
    WebComponents: {
      ready: boolean;
    };
  }
}

// needed for jsonld js library
(window as any).global = window;

if (environment.production) {
  enableProdMode();
}

// platformBrowserDynamic().bootstrapModule(AppModule)
//   .catch(err => console.error(err));


function bootstrapModule() {
  console.log('bootstrapModule')
  platformBrowserDynamic().bootstrapModule(AppModule)
    .catch(err => console.log(err));
}



if (window.WebComponents.ready) {
  // Web Components are ready
  bootstrapModule();
} else {
  // Wait for polyfills to load
  window.addEventListener('WebComponentsReady', bootstrapModule);
}
