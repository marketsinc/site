interface Author {
  name: string;
}

interface PostSnippetProps {
  slug: string;
  title: string;
  description: string;
  date: string;
  authors: Author[];
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function PostSnippet({ slug, title, description, date, authors }: PostSnippetProps) {
  return (
    <article>
      <a href={`/insights/${slug}`}>
        <header>
          <h2 className="title">{title}</h2>
        </header>
        <p>{description}</p>
      </a>
      <footer className="py-2">
        <p>
          <small>
            <span itemProp="datePublished" content={date}>{formatDate(date)}</span>
            {' | By '}
            {authors.map((author, i) => (
              <span key={author.name}>
                {author.name}
                {i < authors.length - 1 ? ', ' : ''}
              </span>
            ))}
          </small>
        </p>
      </footer>
    </article>
  );
}
