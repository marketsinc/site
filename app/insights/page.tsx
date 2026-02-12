import type { Metadata } from 'next';
import { getAllInsights } from '@/lib/insights';
import PostSnippet from '@/components/post-snippet';
import Breadcrumbs from '@/components/breadcrumbs';
import Footer from '@/components/footer';

export const metadata: Metadata = {
  title: 'Insights | Markets, Inc.',
  description: 'Markets, Inc. is a research-driven investment firm dedicated to crypto markets and the emergence of real, functional on-chain economies.',
};

export default function InsightsPage() {
  const insights = getAllInsights();

  return (
    <main className="flex h-screen justify-center p-4">
      <article className="max-w-md">
        <Breadcrumbs title="Insights" isListing />

        <h1 className="title">Insights</h1>

        {insights.length === 0 ? (
          <p>Nothing to see here.</p>
        ) : (
          insights.map((insight, index) => (
            <div key={insight.slug}>
              <PostSnippet
                slug={insight.slug}
                title={insight.title}
                description={insight.description}
                date={insight.date}
                authors={insight.authors}
              />
              {index < insights.length - 1 && <hr className="pb-2" />}
            </div>
          ))
        )}
        <Footer showNewsletter />
      </article>
    </main>
  );
}
