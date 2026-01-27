export const prerender = true;

export function GET() {
	const siteUrl = import.meta.env.PUBLIC_SITE_URL || "";
	const baseUrl = siteUrl.endsWith("/") ? siteUrl.slice(0, -1) : siteUrl;
	const body = `User-agent: *\nAllow: /\n\nSitemap: ${baseUrl || ""}/sitemap.xml\n`;

	return new Response(body, {
		headers: {
			"Content-Type": "text/plain; charset=utf-8",
		},
	});
}
