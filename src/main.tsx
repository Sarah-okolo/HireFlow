
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initializeMockData } from './utils/mockApi.ts';

// Initialize mock data for development
initializeMockData();

createRoot(document.getElementById("root")!).render(<App />);
