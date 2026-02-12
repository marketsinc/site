import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllInsights, getInsightBySlug } from '@/lib/insights';
import Breadcrumbs from '@/components/breadcrumbs';
import Footer from '@/components/footer';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const insights = getAllInsights();
  return insights.map((insight) => ({ slug: insight.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const insight = await getInsightBySlug(slug);
  if (!insight) return {};

  const title = `${insight.title} | Markets, Inc.`;
  const siteUrl = 'https://markets.inc';
  const url = `${siteUrl}/insights/${slug}`;
  const image = insight.featured_image ? `${siteUrl}${insight.featured_image}` : `${siteUrl}/assets/images/favicon/og-image.png`;
  const card = insight.featured_image ? 'summary_large_image' : 'summary';

  return {
    title,
    description: insight.description,
    alternates: { canonical: url },
    openGraph: {
      siteName: 'Markets, Inc.',
      title,
      description: insight.description,
      url,
      type: 'website',
      locale: 'en_US',
      images: [image],
    },
    twitter: {
      card,
      site: '@marketsincorp',
      title,
      description: insight.description,
      images: [image],
    },
  };
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default async function InsightPage({ params }: PageProps) {
  const { slug } = await params;
  const insight = await getInsightBySlug(slug);
  if (!insight) notFound();

  const siteUrl = 'https://markets.inc';

  return (
    <main className="flex h-screen justify-center p-4">
      <article className="max-w-xl">
        <header className="article-header mb-3">
          <Breadcrumbs title={insight.title} slug={slug} />

          <h1 className="title">{insight.title}</h1>

          <p>
            <small>
              {formatDate(insight.date)}
              <span className="px-2">&#8226;</span>
              By {insight.authors.map((a) => a.name).join(', ')}
            </small>
          </p>

        </header>

        <section className="post" dangerouslySetInnerHTML={{ __html: insight.htmlContent || '' }} />

        <Footer showNewsletter showDisclaimer />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'BlogPosting',
              headline: insight.title,
              description: insight.description,
              image: insight.featured_image ? `${siteUrl}${insight.featured_image}` : undefined,
              datePublished: new Date(insight.date).toISOString(),
              dateModified: new Date(insight.date).toISOString(),
              author: insight.authors.map((a) => ({
                '@type': 'Person',
                name: a.name,
              })),
              publisher: {
                '@type': 'Organization',
                name: 'Markets, Inc.',
                logo: {
                  '@type': 'ImageObject',
                  url: `${siteUrl}/assets/images/favicon/og-image.png`,
                },
              },
              mainEntityOfPage: {
                '@type': 'WebPage',
                '@id': `${siteUrl}/insights/${slug}`,
              },
              url: `${siteUrl}/insights/${slug}`,
            }),
          }}
        />
      </article>
    </main>
  );
}
