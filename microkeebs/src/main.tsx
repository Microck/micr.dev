import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// StrictMode removed - causes double-mount which breaks WebGL context in Lanyard 3D component
createRoot(document.getElementById('root')!).render(<App />);
