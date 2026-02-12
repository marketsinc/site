interface BreadcrumbsProps {
  title: string;
  slug?: string;
  isListing?: boolean;
}

export default function Breadcrumbs({ title, slug, isListing = false }: BreadcrumbsProps) {
  return (
    <nav className="flex" aria-label="Breadcrumb" itemScope itemType="https://schema.org/BreadcrumbList">
      <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
        <li className="inline-flex items-center" itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
          <meta itemProp="position" content="1" />
          <a href="/" className="inline-flex items-center text-sm font-medium text-body hover:text-fg-brand" itemProp="item">
            {isListing ? (
              <div className="flex items-center space-x-1.5">
                <svg className="w-3.5 h-3.5 rtl:rotate-180 text-body" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m15 19-7-7 7-7" />
                </svg>
                <span className="inline-flex items-center text-sm font-medium">Home</span>
              </div>
            ) : (
              <span>Markets, Inc.</span>
            )}
            <meta itemProp="name" content="Markets, Inc." />
          </a>
        </li>
        {!isListing && (
          <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <meta itemProp="position" content="2" />
            <div className="flex items-center space-x-1.5">
              <svg className="w-3.5 h-3.5 rtl:rotate-180 text-body" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m9 5 7 7-7 7" />
              </svg>
              <a href="/insights" className="inline-flex items-center text-sm font-medium text-body hover:text-fg-brand" itemProp="item">
                <span itemProp="name">Insights</span>
              </a>
            </div>
          </li>
        )}
        <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem" className="sr-only">
          <meta itemProp="position" content={isListing ? "2" : "3"} />
          <span itemProp="name" aria-current="page">{title}</span>
          {slug && <meta itemProp="item" content={`https://markets.inc/insights/${slug}`} />}
        </li>
      </ol>
    </nav>
  );
}
