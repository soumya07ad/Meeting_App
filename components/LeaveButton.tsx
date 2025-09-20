"use client";

import { useCall } from '@stream-io/video-react-sdk';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';

const LeaveButton = () => {
  const call = useCall();
  const router = useRouter();

  if (!call)
    throw new Error('useCall must be used within a StreamCall component.');

  const leave = async () => {
    try {
      await call.leave();
    } catch (e) {
      // ignore
    }
    router.push('/');
  };

  return (
    <Button onClick={leave} className="bg-red-600">
      Leave
    </Button>
  );
};

export default LeaveButton;
