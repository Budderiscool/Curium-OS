// Define KVNamespace interface to fix the "Cannot find name 'KVNamespace'" error.
interface KVNamespace {
  get(key: string): Promise<string | null>;
  put(key: string, value: string): Promise<void>;
}

interface Env {
  ASSETS: { fetch: typeof fetch };
  CURIUM_KV: KVNamespace;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    
    // API Route for profile synchronization
    if (url.pathname === '/api/profile') {
      if (request.method === 'POST') {
        try {
          const profile = await request.text();
          // We use a simple key for this demo OS, in multi-user environments 
          // you would use a unique ID from an auth header.
          await env.CURIUM_KV.put('user_profile', profile);
          return new Response('Profile synced to cloud', { status: 200 });
        } catch (e) {
          return new Response('Sync error', { status: 500 });
        }
      }
      
      const profile = await env.CURIUM_KV.get('user_profile');
      return new Response(profile || 'null', {
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        }
      });
    }

    // Default: Serve static assets from the /dist directory
    return env.ASSETS.fetch(request);
  }
};