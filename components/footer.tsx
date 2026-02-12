'use client';

import { useState, FormEvent } from 'react';

interface FooterProps {
  showNewsletter?: boolean;
  showDisclaimer?: boolean;
}

export default function Footer({ showNewsletter = false, showDisclaimer = false }: FooterProps) {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const honeypot = (form.elements.namedItem('b_e708c03d87f958566d5f1ee4d_f8c9288bff') as HTMLInputElement).value;
    if (honeypot) return;

    const email = (form.elements.namedItem('EMAIL') as HTMLInputElement).value;
    setStatus('submitting');
    setMessage('');

    const url =
      'https://inc.us9.list-manage.com/subscribe/post-json?u=e708c03d87f958566d5f1ee4d&id=f8c9288bff&f_id=0085c2e1f0' +
      '&EMAIL=' + encodeURIComponent(email) +
      '&tags=246' +
      '&c=_mcCallback';

    (window as any)._mcCallback = function (data: { result: string; msg: string }) {
      if (data.result === 'success') {
        setStatus('success');
        setMessage('Thanks for subscribing!');
      } else {
        setStatus('error');
        setMessage(data.msg.replace(/<[^>]*>/g, ''));
      }
      delete (window as any)._mcCallback;
    };

    const script = document.createElement('script');
    script.src = url;
    document.body.appendChild(script);
  }

  return (
    <footer>
      <hr style={{ marginTop: '5px', padding: '5px' }} />

      {showNewsletter && (
        <div>
          <p className="font-bold">Subscribe to our newsletter</p>
          <p className="text-sm mb-2" style={{ color: 'gray' }}>Get insights delivered to your inbox.</p>
          <form onSubmit={handleSubmit} className="flex gap-2 flex-wrap mb-0 pb-2">
            <input type="text" name="b_e708c03d87f958566d5f1ee4d_f8c9288bff" tabIndex={-1} defaultValue="" style={{ display: 'none' }} />
            <input type="hidden" name="tags" value="246" />
            <input
              type="email"
              name="EMAIL"
              placeholder="Enter your email"
              required
              className="p-2 border border-gray-300 text-base md:text-sm flex-1 min-w-[200px] focus:outline-none focus:border-gray-500"
            />
            <button
              type="submit"
              disabled={status === 'submitting'}
              className="px-4 py-2 bg-black text-white text-sm hover:bg-gray-800 cursor-pointer"
            >
              {status === 'submitting' ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
          {message && (
            <p className="text-sm" style={{ color: status === 'success' ? 'green' : 'red' }}>
              {message}
            </p>
          )}
        </div>
      )}

      {showDisclaimer && (
        <p className="footer-notice">
          This post is for informational purposes only and does not constitute investment advice or an offer to sell
          or a solicitation to buy any securities or investment products. All investments involve risk, including the possible loss of principal.
          Past performance is not indicative of future results. Any forward-looking statements or hypothetical examples
          are subject to risks and uncertainties and are not guarantees of future performance. No client-adviser
          relationship is established by this material. Markets, Inc. assumes no responsibility for the accuracy or completeness
          of third-party information referenced herein.
        </p>
      )}

      <p className="footer-notice">
        Copyright &copy; 2025 Markets, Inc. Digital Assets Fund Management LLC All rights reserved. &quot;Markets, Inc.&quot; is a registered trademark.
      </p>
    </footer>
  );
}
