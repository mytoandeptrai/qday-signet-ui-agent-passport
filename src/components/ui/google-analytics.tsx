import { useEffect } from 'react';
import { siteConfig } from '@/constant';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export const GoogleAnalytics = () => {
  useEffect(() => {
    if (!siteConfig.googleAnalyticsId) {
      console.error('Google Analytics ID not configured. Set VITE_GA_ID or update siteConfig.googleAnalyticsId');
      return;
    }

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${siteConfig.googleAnalyticsId}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };

    window.gtag('js', new Date());
    window.gtag('config', siteConfig.googleAnalyticsId, {
      page_title: document.title,
      page_location: window.location.href,
    });

    console.log('Google Analytics initialized with ID:', siteConfig.googleAnalyticsId);

    return () => {
      const scripts = document.querySelectorAll(`script[src*="googletagmanager"]`);
      // biome-ignore lint/suspicious/useIterableCallbackReturn: <explanation>
      scripts.forEach((script) => script.remove());
    };
  }, []);

  return null;
};

export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, parameters);
  }
};

export const trackPageView = (url: string, title?: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', siteConfig.googleAnalyticsId, {
      page_path: url,
      page_title: title,
    });
  }
};
