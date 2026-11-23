import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import SimulationPage from './pages/SimulationPage.jsx';
import ProjectPage from './pages/ProjectPage.jsx';
import TeamPage from './pages/TeamPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<SimulationPage />} />
        <Route path="project" element={<ProjectPage />} />
        <Route path="team" element={<TeamPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
