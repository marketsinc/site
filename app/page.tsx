export default function Home() {
  return (
    <main className="flex h-screen justify-center p-4 items-center">
      <article className="max-w-md">
        <h1 className="title">Markets, Inc.</h1>
        <p>
          At Markets, Inc. we firmly believe that the protocols and primitives developed in the cryptocurrency sector will revolutionize traditional financial services and markets.
        </p>

        <ul className="flex flex-wrap items-center py-2 text-sm">
          <li className="pr-2">
            <a href="https://investors.markets.inc" title="Investors" className="link underline">
              Investors
            </a>
          </li>
          <li className="pr-2">&bull;</li>
          <li className="pr-2">
            <a href="/insights" title="Insights" className="link underline">
              Insights
            </a>
          </li>
          <li>
            <a href="https://x.com/marketsincorp" title="X" className="link underline">
              X
            </a>
          </li>
        </ul>

        <hr style={{ marginTop: '5px', padding: '5px' }} />
        <p className="footer-notice">
          Copyright 2025 Markets, Inc. Digital Assets Fund Management LLC All rights reserved.
        </p>
      </article>
    </main>
  );
}
