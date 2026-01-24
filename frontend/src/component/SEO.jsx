import { Helmet } from "react-helmet";

const SEO = ({
  title,
  description,
  keywords = "",
  image = "https://srisairam.co.in//assets/main_logo.png",
  url = "https://srisairam.co.in",
  type = "website",
}) => {
    const siteName = "SRI SAI RAM Real Estate & Construction";
    const siteUrl = "https://srisairam.co.in";
  return (
    <Helmet>
      {/* ===== BASIC SEO ===== */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}

      {/* ===== CANONICAL URL ===== */}
      <link rel="canonical" href={url} />

      {/* ===== OPEN GRAPH (Facebook, WhatsApp, LinkedIn) ===== */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />

      {/* ===== TWITTER CARD ===== */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* ===== SEARCH ENGINE DIRECTIVES ===== */}
      <meta name="robots" content="index, follow" />

      {/* ===== MOBILE & RESPONSIVE ===== */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      {/* ===== SITE IDENTITY ===== */}
      <meta name="author" content="Sri Sai Ram Real Estate & Construction" />
      <meta name="publisher" content="Sri Sai Ram Real Estate & Construction" />

      <meta name="theme-color" content="#F5BE86" />

      {/* Basic Schema (Organization) */}
      <script type="application/ld+json">{`
        {
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "${siteName}",
          "url": "${siteUrl}",
          "logo": "${image}",
          "sameAs": [
            "https://facebook.com/srisairamrealestate",
            "https://instagram.com/srisairamrealestate"
          ]
        }
      `}</script>
    </Helmet>
  );
};

export default SEO;
