'use client';

import { ReactNode, useEffect, useState } from 'react';
import { StreamVideoClient, StreamVideo } from '@stream-io/video-react-sdk';
import { tokenProvider, createStreamToken } from '@/actions/stream.actions';
import Loader from '@/components/Loader';

const API_KEY = process.env.NEXT_PUBLIC_STREAM_API_KEY;

const StreamVideoProvider = ({ children }: { children: ReactNode }) => {
  const [videoClient, setVideoClient] = useState<StreamVideoClient>();

  useEffect(() => {
    if (!API_KEY) throw new Error('Stream API key is missing');

    // Create or reuse a per-browser user id so participants have stable ids.
    let userId: string;
    try {
      userId = localStorage.getItem('bonggo_anonymous_id') || '';
      if (!userId) {
        userId = crypto.randomUUID();
        localStorage.setItem('bonggo_anonymous_id', userId);
      }
    } catch (e) {
      // If localStorage is not available, fall back to a generated id in-memory
      userId = 'anonymous-user';
    }

    // Try to pick up a display name previously entered by the user
    let storedName: string | null = null;
    try {
      storedName = localStorage.getItem('bonggo_display_name');
    } catch (e) {
      storedName = null;
    }

    // Provide a tokenProvider that asks the server for a token for this userId
    const wrappedTokenProvider = async () => {
      try {
        // call server action to mint a token for this specific user id
        const token = await createStreamToken(userId);
        return token;
      } catch (e) {
        // fallback to the legacy no-arg tokenProvider
        return tokenProvider();
      }
    };

    const client = new StreamVideoClient({
      apiKey: API_KEY,
      user: {
        id: userId,
        name: storedName || 'Anonymous User',
        image: '/icons/logo.svg',
      },
      tokenProvider: wrappedTokenProvider,
    });

    setVideoClient(client);
  }, []);

  if (!videoClient) return <Loader />;

  return <StreamVideo client={videoClient}>{children}</StreamVideo>;
};

export default StreamVideoProvider;
