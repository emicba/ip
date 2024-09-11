export default {
  async fetch(request) {
    const ip = request.headers.get('cf-connecting-ip');
    const host = request.headers.get('host');
    const accept = request.headers.get('accept') ?? '';

    if (!accept.includes('text/html')) {
      return new Response(ip);
    }

    let headers = '';
    request.headers.forEach((value, key) => {
      if (key.startsWith('cf-') || key.startsWith('x-')) {
        return;
      }
      headers += `<li><a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/${key}" target="_blank" rel="noreferrer">${key}</a>: ${value}</li>`;
    });

    let html = `
        <!doctype html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <style>
              :root {
                color-scheme: light dark;
              }
              html {
                line-height: 1.5;
                -webkit-text-size-adjust: 100%;
                font-family: ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
                font-feature-settings: normal;
                font-variation-settings: normal;
                -webkit-tap-highlight-color: transparent;
              }
              body {
                margin: 0;
                line-height: inherit;
                width: min(64rem, 100% - 4rem);
                margin-inline: auto;
              }
              h1 {
                font-size: 2.25rem;
                line-height: 2.5rem;
                font-weight: 800;
                letter-spacing: -0.025em;
                @media (min-width: 1024px) {
                  font-size: 3rem;
                  line-height: 1;
                }
              }
              h2 {
                font-size: 1.875rem;
                line-height: 2.25rem;
                font-weight: 600;
                letter-spacing: -0.025em;
              }
              li {
                list-style: none;
                margin-top: 0.5rem;
              }
              li a {
                text-transform: capitalize;
                text-decoration: underline;
                text-underline-offset: 4px;
                font-weight: 500;
              }
              p {
                line-height: 1.75rem;
              }
              code {
                border-radius: 0.25rem;
                padding: 0.2rem 0.3rem;
                font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
                font-size: 0.875rem;
                line-height: 1.25rem;
                white-space: pre-wrap;
                background-color: #eee;
                @media (prefers-color-scheme: dark) {
                  background-color: #333;
                }
              }
            </style>
          </head>
          <body>
            <h1>IP: ${ip ?? '&lt;unknown&gt;'}</h1>
            <p>
              <b>NOTE:</b> If you want the raw IP for scripts and stuff just send a request without the <code>Accept</code> header.
            </p>
            <h2 id="sample-usage">Sample usage:</h2>
            <ul>
              <li><code>curl ${host}</code></li>
              <li><code>export IP="$(curl -s ${host})"</code></li>
              <li><code>export IP="$(wget -qO- ${host})"</code></li>
              <li><code>fetch('https://${host}').then(console.log);</code></li>
            </ul>
            <h2>These are the HTTP headers sent by your web browser:</h2>
            <ul>
              ${headers}
            </ul>
          </body>
        </html>`;
    return new Response(html, {
      headers: {
        'cache-control': 'no-store',
        'content-type': 'text/html',
      },
    });
  },
} satisfies ExportedHandler<Env>;
