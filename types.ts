
export interface AppLink {
  label: string;
  url: string;
}

export interface AppItem {
  id: string;
  name: string;
  shortName: string; // Used for brackets like [KD]
  description: string;
  version: string;
  downloads: string;
  size: string;
  category: string;
  isNew?: boolean;
  rating?: string; // New Rating Field
  iconUrl?: string; // Main icon image (External URL)
  logoUrl?: string; // Small logo badge (External URL)
  iconColor?: string; // Fallback if no image
  downloadUrl?: string; // URL for the download button
  buttonText?: string; // Custom button text e.g. "LET'S STUDY"
  links?: AppLink[]; // Array of links to show in a popup
}

export type Category = 'All' | 'Educational' | 'New' | 'Popular' | 'Downloadable';

export interface AboutData {
  name: string;
  alias: string;
  quote: string;
  roleBadge: string;
  imageUrl: string;
  details: {
    education: { title: string; value: string };
    location: { title: string; value: string };
    birthday: { title: string; value: string };
    founder: { title: string; value: string };
  };
}

export interface StoreSettings {
  splashLogoUrl: string;
}
