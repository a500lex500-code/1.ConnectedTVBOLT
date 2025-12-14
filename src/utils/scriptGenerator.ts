import { ScrapedData, AdScript } from '../types';

export function generateScript(data: ScrapedData): AdScript {
  const domain = new URL(data.url).hostname.replace('www.', '');

  const segments = [
    {
      text: `Discover ${data.title}`,
      duration: 3,
    },
    {
      text: data.description,
      duration: 5,
    },
    {
      text: 'Transform your experience today',
      duration: 3,
    },
    {
      text: 'Join thousands of satisfied customers',
      duration: 4,
    },
    {
      text: 'Premium quality, unbeatable value',
      duration: 3,
    },
    {
      text: 'Limited time offer available now',
      duration: 3,
    },
    {
      text: `Visit ${domain}`,
      duration: 3,
    },
    {
      text: 'Act now and get started',
      duration: 3,
    },
    {
      text: 'Your journey begins here',
      duration: 3,
    },
  ];

  return {
    segments,
    totalDuration: segments.reduce((sum, seg) => sum + seg.duration, 0),
  };
}
