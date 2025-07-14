// src/components/Bot.jsx
import { useEffect } from 'react';

const Bot = () => {
  useEffect(() => {
    // Inject botpress script only once
    const script = document.createElement('script');
    script.src = 'https://cdn.botpress.cloud/webchat/v3.2/inject.js';
    script.async = true;
    document.body.appendChild(script);

    // Optional: your own bot config (similar to script2.js)
    window.botpressWebChat.init({
      botId: 'YOUR_BOT_ID',
      hostUrl: 'https://cdn.botpress.cloud/webchat/v3.2',
      // Add more config if needed
    });

    // Cleanup on unmount
    return () => {
      document.querySelector('[src="https://cdn.botpress.cloud/webchat/v3.2/inject.js"]')?.remove();
      const iframe = document.querySelector('iframe[src*="botpress"]');
      iframe?.remove();
    };
  }, []);

  return null;
};

export default Bot;