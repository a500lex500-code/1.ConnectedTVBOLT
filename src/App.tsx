import { useState } from 'react';
import { Download, Play } from 'lucide-react';
import { scrapeUrl } from './utils/scraper';
import { generateScript } from './utils/scriptGenerator';
import { generateVideo } from './utils/videoGenerator';

type Step = 'idle' | 'scraping' | 'script' | 'video' | 'pack' | 'complete';

function App() {
  const [url, setUrl] = useState('');
  const [currentStep, setCurrentStep] = useState<Step>('idle');
  const [progress, setProgress] = useState(0);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const steps = [
    { id: 'scraping', label: 'Scraping' },
    { id: 'script', label: 'Script' },
    { id: 'video', label: 'Video' },
    { id: 'pack', label: 'Pack' },
  ];

  const getStepIndex = (step: Step) => {
    const index = steps.findIndex(s => s.id === step);
    return index === -1 ? 0 : index;
  };

  const handleGenerate = async () => {
    if (!url) return;

    setIsGenerating(true);
    setError(null);
    setVideoUrl(null);
    setProgress(0);

    try {
      setCurrentStep('scraping');
      setProgress(10);
      const scrapedData = await scrapeUrl(url);
      setProgress(25);

      setCurrentStep('script');
      const script = generateScript(scrapedData);
      setProgress(40);

      setCurrentStep('video');
      const videoBlob = await generateVideo(scrapedData, script, (p) => {
        setProgress(40 + p * 0.5);
      });
      setProgress(90);

      setCurrentStep('pack');
      const videoObjectUrl = URL.createObjectURL(videoBlob);
      setVideoUrl(videoObjectUrl);
      setProgress(100);

      setCurrentStep('complete');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setCurrentStep('idle');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!videoUrl) return;
    const a = document.createElement('a');
    a.href = videoUrl;
    a.download = 'ctv-ad.mp4';
    a.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">CTV Ad Generator</h1>
            <p className="text-slate-300">Create professional 30-second ads from any URL</p>
          </div>

          <div className="space-y-6">
            <div>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                disabled={isGenerating}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={!url || isGenerating}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-slate-600 disabled:to-slate-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:cursor-not-allowed"
            >
              <Play size={20} />
              {isGenerating ? 'Generating...' : 'Generate 30-s CTV Ad'}
            </button>

            {isGenerating && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  {steps.map((step, index) => (
                    <div key={step.id} className="flex-1 flex items-center">
                      <div className="flex flex-col items-center w-full">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                            getStepIndex(currentStep) > index
                              ? 'bg-green-500 text-white'
                              : getStepIndex(currentStep) === index
                              ? 'bg-blue-500 text-white animate-pulse'
                              : 'bg-white/10 text-slate-400'
                          }`}
                        >
                          {index + 1}
                        </div>
                        <div
                          className={`text-xs mt-2 font-medium ${
                            getStepIndex(currentStep) >= index ? 'text-white' : 'text-slate-400'
                          }`}
                        >
                          {step.label}
                        </div>
                      </div>
                      {index < steps.length - 1 && (
                        <div
                          className={`h-1 flex-1 mx-2 rounded ${
                            getStepIndex(currentStep) > index ? 'bg-green-500' : 'bg-white/10'
                          }`}
                        />
                      )}
                    </div>
                  ))}
                </div>

                <div className="bg-white/10 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300 rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-center text-slate-300 text-sm">{progress}%</p>
              </div>
            )}

            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4">
                <p className="text-red-200 text-sm">{error}</p>
              </div>
            )}

            {videoUrl && currentStep === 'complete' && (
              <div className="space-y-4">
                <div className="bg-black rounded-lg overflow-hidden">
                  <video src={videoUrl} controls className="w-full" />
                </div>
                <button
                  onClick={handleDownload}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Download size={20} />
                  Download MP4
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="text-center mt-6 text-slate-400 text-sm">
          <p>Free • No Backend • Runs in Browser</p>
        </div>
      </div>
    </div>
  );
}

export default App;
