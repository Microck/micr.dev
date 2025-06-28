export interface KeyboardBuild {
  id: string;
  title: string;
  youtubeTitle?: string;
  category: "MX" | "EC";
  timestamp: string;
  images: string[];
  youtubeUrl: string;
  specs: {
    [key: string]: string;
  };
}