/// <reference types="react-scripts" />

import './assets/styles/index.css';
import React, { Suspense, useEffect, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './stores/store';

import { LogService } from './services/logService';

import { MetaTags } from './components/MetaTags';
import LazyLoading from './components/LazyLoading';

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));

const logService = new LogService();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

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
          <Route
            path="/"
            element={
              <MetaTags
                title="Home Page"
                description="Welcome to the homepage of our website."
                keywords="home, welcome, react"
                author="John Doe"
                image="/images/home.jpg"
                url="https://mywebsite.com/home"
              >
                <Home />
              </MetaTags>
            }
          />
          <Route
            path="/about"
            element={
              <MetaTags
                title="About Us"
                description="Learn more about our website and our mission."
                keywords="about, company, mission"
                author="John Doe"
                image="/images/about.jpg"
                url="https://mywebsite.com/about"
              >
                <About />
              </MetaTags>
            }
          />
          <Route
            path="/contact"
            element={
              <MetaTags
                title="Contact Us"
                description="Get in touch with us for any inquiries."
                keywords="contact, email, inquiries"
                author="John Doe"
                image="/images/contact.jpg"
                url="https://mywebsite.com/contact"
              >
                <Contact />
              </MetaTags>
            }
          />
        </Routes>
      </Suspense>
    </Router>
    </Provider>
  </React.StrictMode>
);
