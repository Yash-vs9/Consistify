'use client';

import { useEffect } from 'react';

interface BotpressWidgetProps {
  username?: string;
}

declare global {
  interface Window {
    botpress: any;
    botpressWebChat: any;
  }
}

const BotpressWidgetHeadless = ({ username }: BotpressWidgetProps) => {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (document.getElementById('bp-webchat')) return;

    const script = document.createElement('script');
    script.src = 'https://cdn.botpress.cloud/webchat/v3.2/inject.js';
    script.async = true;
    script.id = 'bp-webchat';
    document.body.appendChild(script);

    script.onload = () => {
      console.log('✅ Botpress script loaded');

      // Create an invisible anchor for injection
      const anchor = document.createElement('div');
      anchor.id = 'hidden-botpress-container';
      anchor.style.display = 'none'; // hide completely
      document.body.appendChild(anchor);

      // Now init with selector pointing to it
      window.botpress.init({
        botId: '0b639e72-ebb2-471f-9430-18aa97f879b4',
        clientId: '23256eb0-67de-406d-9967-3f5ccb897ca2',
        messagingUrl: 'https://messaging.botpress.cloud',
        hostUrl: 'https://cdn.botpress.cloud/webchat/v3.2',
        user: {
          data: {
            username: username || 'guest@consistify.app',
          },
        },
        selector: '#hidden-botpress-container', // ✅ inject but stay hidden
        configuration: {
          showPoweredBy: false,
          botName: 'Task Manager',
          themeMode: 'dark',
          color: '#06b6d4',
        },
      });

      // Wait for it to become available
      const waitForWebchat = setInterval(() => {
        if (window.botpressWebChat?.onEvent) {
          clearInterval(waitForWebchat);
          console.log('✅ WebChat headless ready');
        }
      }, 200);
    };

    return () => {
      const s = document.getElementById('bp-webchat');
      if (s) document.body.removeChild(s);

      const anchor = document.getElementById('hidden-botpress-container');
      if (anchor) document.body.removeChild(anchor);
    };
  }, [username]);

  return null;
};

export default BotpressWidgetHeadless;