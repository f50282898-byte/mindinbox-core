import { Metadata } from 'next';

export default function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://mindinbox.com';

  const routes = [
    '',
    '/auth',
    '/dashboard/tracker',
    '/dashboard/utopia',
    '/dashboard/sanctum'
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  return routes;
}

