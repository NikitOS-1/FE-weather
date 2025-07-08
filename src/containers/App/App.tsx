import { Routes, Route } from 'react-router-dom';
import { HomePage } from '../HomePage/HomePage';
import CityPage from '../CityPage/CityPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/:cityKey" element={<CityPage />} />
    </Routes>
  );
}

export default App;
