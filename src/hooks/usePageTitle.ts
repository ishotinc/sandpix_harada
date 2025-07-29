import { useEffect } from 'react';

interface UsePageTitleOptions {
  title: string;
  description?: string;
}

export function usePageTitle({ title, description }: UsePageTitleOptions) {
  useEffect(() => {
    const baseSiteTitle = 'SandPix - AI Landing Page Generator';
    const pageTitle = title === baseSiteTitle ? title : `${title} - SandPix`;
    
    // Update document title
    document.title = pageTitle;
    
    // Update meta description if provided
    if (description) {
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', description);
      }
    }
    
    // Update Open Graph title
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', pageTitle);
    }
    
    // Update Open Graph description if provided
    if (description) {
      const ogDescription = document.querySelector('meta[property="og:description"]');
      if (ogDescription) {
        ogDescription.setAttribute('content', description);
      }
    }
    
    // Update Open Graph image based on page
    const ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage) {
      // Use home-specific OG image for TOP page
      if (title === 'SandPix - Generate Landing Pages with AI - Get Started Free') {
        ogImage.setAttribute('content', '/images/og-image-home.png');
      } else {
        ogImage.setAttribute('content', '/images/og-image.png');
      }
    }
    
    // Update Twitter title
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) {
      twitterTitle.setAttribute('content', pageTitle);
    }
    
    // Update Twitter description if provided
    if (description) {
      const twitterDescription = document.querySelector('meta[name="twitter:description"]');
      if (twitterDescription) {
        twitterDescription.setAttribute('content', description);
      }
    }
  }, [title, description]);
}