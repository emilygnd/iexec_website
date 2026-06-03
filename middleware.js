// Vercel Edge Middleware — HTTP Basic Auth password gate (works on the free Hobby plan).
// Set SITE_USER and SITE_PASSWORD in Vercel → Project → Settings → Environment Variables,
// then redeploy. Until SITE_PASSWORD is set, the whole site stays locked.
export const config = { matcher: '/:path*' };

export default function middleware(request) {
  const USER = process.env.SITE_USER || 'iexec';
  const PASS = process.env.SITE_PASSWORD;
  const header = request.headers.get('authorization') || '';

  if (PASS) {
    const expected = 'Basic ' + btoa(`${USER}:${PASS}`);
    if (header === expected) return; // correct credentials → let the request through
  }

  return new Response('Authentication required.', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="iExec preview", charset="UTF-8"',
      'Content-Type': 'text/plain',
    },
  });
}
