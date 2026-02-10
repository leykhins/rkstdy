export const prerender = true;

export function GET() {
	const siteUrl = import.meta.env.PUBLIC_SITE_URL || "";
	const baseUrl = siteUrl.endsWith("/") ? siteUrl.slice(0, -1) : siteUrl;
	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n` +
		`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
		`  <url>\n` +
		`    <loc>${baseUrl || ""}/</loc>\n` +
		`    <changefreq>weekly</changefreq>\n` +
		`    <priority>1.0</priority>\n` +
		`  </url>\n` +
		`  <url>\n` +
		`    <loc>${baseUrl || ""}/privacy-policy</loc>\n` +
		`    <changefreq>yearly</changefreq>\n` +
		`    <priority>0.3</priority>\n` +
		`  </url>\n` +
		`  <url>\n` +
		`    <loc>${baseUrl || ""}/terms-of-service</loc>\n` +
		`    <changefreq>yearly</changefreq>\n` +
		`    <priority>0.3</priority>\n` +
		`  </url>\n` +
		`</urlset>\n`;

	return new Response(sitemap, {
		headers: {
			"Content-Type": "application/xml; charset=utf-8",
		},
	});
}
