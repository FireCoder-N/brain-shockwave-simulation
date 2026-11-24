import { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Layout from './components/Layout.jsx';
import SimulationPage from './pages/SimulationPage.jsx';
import TeamPage from './pages/TeamPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

// Markdown + KaTeX are only needed on the Project page: load them in a separate chunk.
const ProjectPage = lazy(() => import('./pages/ProjectPage.jsx'));

export default function App() {
  const { t } = useTranslation();
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<SimulationPage />} />
        <Route
          path="project"
          element={
            <Suspense fallback={<p className="p-10 text-muted">{t('common.loading')}</p>}>
              <ProjectPage />
            </Suspense>
          }
        />
        <Route path="team" element={<TeamPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
