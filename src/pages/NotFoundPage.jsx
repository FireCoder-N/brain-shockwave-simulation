import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function NotFoundPage() {
  const { t } = useTranslation();
  return (
    <div className="mx-auto grid max-w-md flex-1 place-content-center px-4 py-24 text-center">
      <p className="font-display text-6xl font-bold text-accent">404</p>
      <h1 className="mt-4 text-2xl font-semibold">{t('notFound.title')}</h1>
      <Link to="/" className="mt-6 text-sm font-medium text-accent hover:underline">
        {t('notFound.back')}
      </Link>
    </div>
  );
}
