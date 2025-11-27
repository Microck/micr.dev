import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { ThemeProvider } from './contexts/ThemeContext';

// Theme switching logic
const getInitialTheme = (): string => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark' || savedTheme === 'light') {
    return savedTheme;
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const applyTheme = (theme: string) => {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');
  } else {
    document.documentElement.classList.add('light');
    document.documentElement.classList.remove('dark');
  }
};

// Set initial theme
const initialTheme = getInitialTheme();
applyTheme(initialTheme);

// Store theme in localStorage
localStorage.setItem('theme', initialTheme);

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  if (!localStorage.getItem('theme')) {
    const newTheme = e.matches ? 'dark' : 'light';
    applyTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  }
});

// Global theme toggle function
(window as any).toggleTheme = () => {
  const currentTheme = localStorage.getItem('theme') || 'light';
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  applyTheme(newTheme);
  localStorage.setItem('theme', newTheme);
  return newTheme;
};

// Smooth scroll restoration logic
const enableSmoothScroll = () => {
  if (!('scrollBehavior' in document.documentElement.style)) {
    // Add smooth scroll polyfill
    (document.documentElement as any).style.scrollBehavior = 'smooth';
  }
  
  // Smooth scroll for internal links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e: Event) {
      e.preventDefault();
      const href = anchor.getAttribute('href');
      if (href && href !== '#') {
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });
};

// Initialize smooth scroll
enableSmoothScroll();

// Restore scroll position
const restoreScrollPosition = () => {
  const scrollPosition = sessionStorage.getItem('scrollPosition');
  if (scrollPosition) {
    window.scrollTo(0, parseInt(scrollPosition));
    sessionStorage.removeItem('scrollPosition');
  }
};

// Save scroll position before unload
window.addEventListener('beforeunload', () => {
  sessionStorage.setItem('scrollPosition', window.scrollY.toString());
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
);

// Restore scroll position after mount
restoreScrollPosition();
