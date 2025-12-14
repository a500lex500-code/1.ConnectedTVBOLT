export interface ScrapedData {
  title: string;
  description: string;
  images: string[];
  primaryColor: string;
  url: string;
}

export interface ScriptSegment {
  text: string;
  duration: number;
}

export interface AdScript {
  segments: ScriptSegment[];
  totalDuration: number;
}
