import {
  APP_STORE_URL,
  BRAND_NAME,
  COMPANY_ADDRESS,
  COMPANY_LEGAL_NAME,
  SITE_URL,
  SUPPORT_EMAIL,
  absoluteUrl,
} from "@/lib/site";

const organizationId = `${SITE_URL}/#organization`;
const websiteId = `${SITE_URL}/#website`;
const appId = `${SITE_URL}/#app`;
const logoUrl = absoluteUrl("/occudule-logo.png");

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": organizationId,
      name: BRAND_NAME,
      legalName: COMPANY_LEGAL_NAME,
      alternateName: ["Occudule.com", "Occudule App"],
      url: SITE_URL,
      email: SUPPORT_EMAIL,
      logo: {
        "@type": "ImageObject",
        url: logoUrl,
      },
      address: {
        "@type": "PostalAddress",
        ...COMPANY_ADDRESS,
      },
      brand: {
        "@type": "Brand",
        name: BRAND_NAME,
      },
      sameAs: [APP_STORE_URL],
    },
    {
      "@type": "WebSite",
      "@id": websiteId,
      name: BRAND_NAME,
      alternateName: ["Occudule.com", "Occudule App"],
      url: SITE_URL,
      description:
        "Occudule is AI email productivity for busy parents—triage school threads, drafts, and family logistics in one place.",
      inLanguage: "en",
      publisher: { "@id": organizationId },
    },
    {
      "@type": "SoftwareApplication",
      "@id": appId,
      name: BRAND_NAME,
      url: SITE_URL,
      applicationCategory: "LifestyleApplication",
      operatingSystem: "iOS",
      description:
        "AI email productivity for busy parents. Occudule turns school threads into events, to-dos, and a shared family hub.",
      downloadUrl: APP_STORE_URL,
      installUrl: APP_STORE_URL,
      image: logoUrl,
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      publisher: { "@id": organizationId },
    },
  ],
};

export function SiteJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
