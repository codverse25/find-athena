export const config = { runtime: "edge" };

export default async (req) => {
  const url = new URL(req.url);
  const targetPath = url.pathname.replace("/api/athena", "");
  const targetUrl = `https://apiathena.unira.ac.id/api${targetPath}${url.search}`;

  const modifiedHeaders = new Headers(req.headers);

  // Hapus header yang akan dipalsukan
  modifiedHeaders.delete("host");
  modifiedHeaders.delete("origin");
  modifiedHeaders.delete("referer");

  // Spoof
  modifiedHeaders.set("origin", "https://unira.ac.id");
  modifiedHeaders.set("referer", "https://unira.ac.id/");
  modifiedHeaders.set("host", "apiathena.unira.ac.id");

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: modifiedHeaders,
      body:
        req.method !== "GET" && req.method !== "HEAD" ? req.body : undefined,
    });

    const corsHeaders = new Headers(response.headers);
    corsHeaders.set("access-control-allow-origin", "*");

    return new Response(response.body, {
      status: response.status,
      headers: corsHeaders,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "Proxy error",
        message: error.message,
        targetUrl: targetUrl,
      }),
      {
        status: 500,
        headers: { "content-type": "application/json" },
      },
    );
  }
};
