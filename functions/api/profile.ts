// Fix: Added missing Cloudflare Pages environment type definitions for KVNamespace and PagesFunction
interface KVNamespace {
  get(key: string): Promise<string | null>;
  put(key: string, value: string): Promise<void>;
}

interface PagesFunction<Env = any> {
  (context: {
    request: Request;
    env: Env;
  }): Promise<Response> | Response;
}

interface Env {
  CURIUM_KV: KVNamespace;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  if (request.method === 'POST') {
    try {
      const profile = await request.text();
      // Simple key for demo profile persistence
      await env.CURIUM_KV.put('user_profile', profile);
      return new Response('Profile synced to cloud', { status: 200 });
    } catch (e) {
      return new Response('Sync error', { status: 500 });
    }
  }

  // Handle GET requests
  try {
    const profile = await env.CURIUM_KV.get('user_profile');
    return new Response(profile || 'null', {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });
  } catch (e) {
    return new Response('null', { status: 200 });
  }
};
