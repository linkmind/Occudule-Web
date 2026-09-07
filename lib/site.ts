/** Production canonical host (www). Apex occudule.com redirects here. */
export const SITE_URL = "https://www.occudule.com";

/** Official iOS listing. */
export const APP_STORE_URL = "https://apps.apple.com/us/app/occudule/id6761225313";
export const APP_STORE_ID = "6761225313";

/**
 * Google Play listing. Set this when the Android app is published; the download
 * page will replace the "Coming soon" slot with a store badge.
 */
export const PLAY_STORE_URL: string | null = null;

export const IOS_PREVIEW_VIDEO_SRC = "/videos/occudule-ios-app-preview.mp4";
export const IOS_PREVIEW_POSTER_SRC = "/videos/occudule-ios-app-preview-poster.jpg";

export function absoluteUrl(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
