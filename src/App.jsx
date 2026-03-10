import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import BeerDetail from './pages/BeerDetail';
import AddEditBeer from './pages/AddEditBeer';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="beer/:id" element={<BeerDetail />} />
        <Route path="add" element={<AddEditBeer />} />
        <Route path="edit/:id" element={<AddEditBeer />} />
      </Route>
    </Routes>
  );
}

export default App;
