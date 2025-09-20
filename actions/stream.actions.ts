'use server';

import { StreamClient } from '@stream-io/node-sdk';

const STREAM_API_KEY = process.env.STREAM_API_KEY || process.env.NEXT_PUBLIC_STREAM_API_KEY;
const STREAM_API_SECRET = process.env.STREAM_API_SECRET;

export const tokenProvider = async () => {
  // Fallback to an anonymous server-issued user id when no auth is present.
  // This removes the Clerk dependency and allows the server to mint tokens
  // using the Stream server API secret.
  const userId = 'anonymous-server-user';

  if (!STREAM_API_KEY) throw new Error('Stream API key is missing');
  if (!STREAM_API_SECRET) throw new Error('Stream API secret is missing');

  const streamClient = new StreamClient(STREAM_API_KEY, STREAM_API_SECRET);

  const expirationTime = Math.floor(Date.now() / 1000) + 3600;
  const issuedAt = Math.floor(Date.now() / 1000) - 60;

  const token = streamClient.createToken(userId, expirationTime, issuedAt);

  return token;
};
