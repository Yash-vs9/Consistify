'use client';
import { useEffect } from 'react';

interface BotpressWidgetProps {
  username?: string;
}

declare global {
  interface Window {
    botpress: any;
  }
}

const BotpressWidget = ({ username }: BotpressWidgetProps) => {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (document.getElementById('bp-webchat')) return;

    const script = document.createElement('script');
    script.src = 'https://cdn.botpress.cloud/webchat/v3.2/inject.js';
    script.async = true;
    script.id = 'bp-webchat';
    document.body.appendChild(script);

    script.onload = () => {
      console.log('✅ Botpress script loaded ');

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
        configuration: {
          botName: 'Task Manager',
          themeMode: 'dark',
          color: '#3B82F6',
          variant:"solid",
          botAvatar:"https://files.bpcontent.cloud/2025/07/19/14/20250719143105-QZGOT5K7.png",
          fabImage:"https://files.bpcontent.cloud/2025/07/19/14/20250719143024-AI9MUICL.png",
          fontFamily: 'Inter',
          radius: 2,
          showPoweredBy: false,
          additionalStylesheetUrl: "https://files.bpcontent.cloud/2025/07/19/11/20250719113152-PW8IQ19Y.css",
        }
      });
    };

    return () => {
      const existing = document.getElementById('bp-webchat');
      if (existing) document.body.removeChild(existing);
    };
  }, [username]);

  return null;
};

export default BotpressWidget;