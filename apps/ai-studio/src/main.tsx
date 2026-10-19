import { StrictMode, Suspense } from 'react';
import * as ReactDOM from 'react-dom/client';

import { openFromUrl } from './app/open-from-url';
import { OpenedApp } from './app/opened-app';
import { AppBoundary } from './components/open-from-url/app-boundary';
import { LoadingScreen } from './components/open-from-url/loading-screen';

// The editor paints whatever `wb-theme` stores, and an unset key is light.
try {
  localStorage.setItem('wb-theme', 'dark');
} catch {
  // A blocked storage API still leaves the attribute below for this load.
}
document.documentElement.dataset['theme'] = 'dark';

// Started once, outside render: the editor fixes its diagram at mount, and StrictMode would repeat an effect.
const opening = openFromUrl(globalThis.location.search);

ReactDOM.createRoot(document.querySelector('#root') as HTMLElement).render(
  <StrictMode>
    <AppBoundary>
      <Suspense fallback={<LoadingScreen />}>
        <OpenedApp opening={opening} />
      </Suspense>
    </AppBoundary>
  </StrictMode>,
);
