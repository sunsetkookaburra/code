import { serve } from "https://deno.land/std@0.156.0/http/server.ts";

const DEFAULT_BRANCH = "main";

const pat = new URLPattern({
  pathname: "/:proj([0-9A-Za-z_.\-]+(?:@[0-9A-Za-z_.\-]+)?)/:path*",
});

function remap(url: string) {
  const result = pat.exec(url);
  if (result === null) {
    return new Response(null, { status: 404 });
  } else {
    const [project, branch] = result.pathname.groups.proj.split("@") as [
      string,
      string?,
    ];
    const path = result.pathname.groups.path;
    return fetch(
      `https://raw.githubusercontent.com/sunsetkookaburra/${project}/${
        branch ?? DEFAULT_BRANCH
      }/${path}`,
    );
  }
}

serve((req) => remap(req.url));
