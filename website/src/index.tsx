/// <reference types="react-scripts" />

import './assets/styles/index.css';
import React, { Suspense, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store/store';

import { LogService } from './services/logService';

import LazyLoading from './components/LazyLoading';

const Home = React.lazy(() => import('./pages/Home'));
const About = React.lazy(() => import('./pages/About'));
const Contact = React.lazy(() => import('./pages/Contact'));
const NotFound = React.lazy(() => import('./pages/NotFound'));

const logService = new LogService();

// Meta Tags Configuration
const metaTags = [
  { name: 'charset', content: 'UTF-8' },
  { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
  { name: 'description', content: 'LifeVerse – Das realistischste Open-World-Erlebnis, das jemals erschaffen wurde.' },
  { name: 'keywords', content: 'LifeVerse, Open World, Simulation, Realismus, MMO, Sandbox, RPG, Multiplayer, Story' },
  { name: 'author', content: 'LifeVerse Studios' },
  { name: 'robots', content: 'index, follow' },
  { property: 'og:title', content: 'LifeVerse – Eine Welt, die sich echt anfühlt' },
  { property: 'og:description', content: 'Tauche ein in LifeVerse – eine grenzenlose Simulation, die das echte Leben widerspiegelt.' },
  { property: 'og:image', content: '/assets/img/lifeverse-preview.jpg' },
  { property: 'og:url', content: window.location.href },
  { property: 'og:type', content: 'website' },
  { name: 'twitter:card', content: 'summary_large_image' },
  { name: 'twitter:title', content: 'LifeVerse – Die lebendigste Open-World-Simulation' },
  { name: 'twitter:description', content: 'Eine endlose, dynamische Welt mit über 1000 Stunden Story und realistischen Mechaniken.' },
  { name: 'twitter:image', content: '/assets/img/lifeverse-preview.jpg' },
  { rel: 'canonical', href: window.location.href }
];

metaTags.forEach(tag => {
  const meta = document.createElement(tag.name ? 'meta' : 'link');
  Object.entries(tag).forEach(([key, value]) => {
    meta.setAttribute(key, value);
  });
  document.head.appendChild(meta);
});

const favicon = document.createElement('link');
favicon.rel = 'icon';
favicon.href = '/assets/webp/logo.webp';
document.head.appendChild(favicon);

const themeColor = document.createElement('meta');
themeColor.name = 'theme-color';
themeColor.content = '#000000';
document.head.appendChild(themeColor);

const manifest = document.createElement('link');
manifest.rel = 'manifest';
manifest.href = '/manifest.json';
document.head.appendChild(manifest);

logService.info('App has started successfully!', 'App Start');

// Root Component
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// Route Change Logging
const LogRouteChanges = () => {
  const location = useLocation();

  useEffect(() => {
    logService.info(`Navigated to ${location.pathname}`, 'Route Changed');
  }, [location]);

  return null;
};

root.render(
  <React.StrictMode>
    <Provider store={store}> 
      <Router>
        <LogRouteChanges />
        <Suspense fallback={<LazyLoading />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Router>
    </Provider>
  </React.StrictMode>
);
