import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const domain = process.env.NEXT_PUBLIC_DOMAIN;

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/admin/',
        '/_next/',
        '/static/',
        '/*.json$',
        '/*.xml$',
      ],
    },
    sitemap: `${domain}/sitemap.xml`,
    host: domain,
  };
}