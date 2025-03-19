import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        // If it is an entry point component for a large section of app, we lazy load to improve app load time and speed
        // No modules - structure is a single source of truth for feature organisation
        // I called this feature as "fruits" for the sake of example
        path: '', loadComponent: () =>
            import('./fruits/search/search.component').then((m) => m.SearchComponent),
    },
];
