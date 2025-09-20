'use client';

import { useCall, useCallStateHooks } from '@stream-io/video-react-sdk';

import { Button } from './ui/button';
import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';

const EndCallButton = ({ showText = false, forceShow = false }: { showText?: boolean; forceShow?: boolean }) => {
  const call = useCall();
  const router = useRouter();

  if (!call)
    throw new Error(
      'useStreamCall must be used within a StreamCall component.',
    );

  // https://getstream.io/video/docs/react/guides/call-and-participant-state/#participant-state-3
  const { useLocalParticipant } = useCallStateHooks();
  const localParticipant = useLocalParticipant();

  const isMeetingOwner =
    localParticipant &&
    call.state.createdBy &&
    localParticipant.userId === call.state.createdBy.id;

  if (!isMeetingOwner && !forceShow) return null;

  const endCall = async () => {
    await call.endCall();
    router.push('/');
  };

  return (
    <Button onClick={endCall} className="bg-red-500 rounded-full p-2" aria-label="End call for everyone">
      <X size={16} />
      {showText ? <span className="ml-2">End call for everyone</span> : null}
    </Button>
  );
};

export default EndCallButton;
