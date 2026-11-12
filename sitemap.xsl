<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:s="http://www.sitemaps.org/schemas/sitemap/0.9">
<xsl:output method="html" encoding="UTF-8" indent="yes"/>
<xsl:template match="/">
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<meta name="robots" content="noindex"/>
<title>XML Sitemap — The Juris Institute</title>
<style>
:root{--bg:#F2F4F7;--surface:#FFFFFF;--ink:#111827;--ink-2:#374151;--ink-3:#6B7280;--border:#D1D8E4;--red:#BE1F24;--navy:#1C3058}
@media (prefers-color-scheme:dark){:root{--bg:#0D1520;--surface:#152030;--ink:#EDF0F5;--ink-2:#B8C4D4;--ink-3:#7A90A8;--border:#1E3050;--red:#E04448;--navy:#0A1020}}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:system-ui,-apple-system,"Segoe UI",sans-serif;background:var(--bg);color:var(--ink);line-height:1.55}
header{background:var(--navy);color:#EDF0F5;padding:2rem max(20px,env(safe-area-inset-left,0px))}
header .in{max-width:900px;margin:0 auto}
header h1{font-family:Georgia,"Times New Roman",serif;font-size:1.8rem;font-weight:600;margin-bottom:0.4rem}
header p{color:#92A3BC;font-size:0.92rem}
header a{color:#fff}
main{max-width:900px;margin:2rem auto;padding:0 max(20px,env(safe-area-inset-left,0px))}
ol{list-style:none;background:var(--surface);border:1px solid var(--border);border-radius:8px;overflow:hidden}
li{padding:0.85rem 1.25rem;border-bottom:1px solid var(--border);display:flex;flex-wrap:wrap;justify-content:space-between;gap:0.25rem 1rem}
li:last-child{border-bottom:0}
li a{color:var(--ink);text-decoration:none;word-break:break-all;min-width:0}
li a:hover{color:var(--red)}
li span{color:var(--ink-3);font-size:0.82rem;white-space:nowrap}
</style>
</head>
<body>
<header><div class="in">
<h1>The Juris Institute XML Sitemap</h1>
<p>This file helps search engines find every page on the site. It lists <xsl:value-of select="count(s:urlset/s:url)"/> pages. For an easier-to-browse list, see the <a href="sitemap.html">Site Map page</a>.</p>
</div></header>
<main>
<ol>
<xsl:for-each select="s:urlset/s:url">
<li><a href="{s:loc}"><xsl:value-of select="s:loc"/></a><span>Updated <xsl:value-of select="s:lastmod"/></span></li>
</xsl:for-each>
</ol>
</main>
</body>
</html>
</xsl:template>
</xsl:stylesheet>
