'use client';
import { useEffect, useState } from 'react';
import {
  DeviceSettings,
  VideoPreview,
  useCall,
  useCallStateHooks,
} from '@stream-io/video-react-sdk';

import Alert from './Alert';
import { Button } from './ui/button';
import ErrorBoundary from './ErrorBoundary';

const CameraDiagnostic = () => {
  const [status, setStatus] = useState<string>('unknown');

  const check = async () => {
    try {
      setStatus('requesting');
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      setStatus('granted');
      // stop tracks immediately
      stream.getTracks().forEach((t) => t.stop());
    } catch (e: any) {
      setStatus('error: ' + (e?.message || String(e)));
    }
  };

  return (
    <div className="mt-2 w-full max-w-md text-sm text-sky-2">
      <div className="mb-1">Camera diagnostic: {status}</div>
      <div className="flex gap-2">
        <button onClick={check} className="rounded bg-sky-600 px-3 py-1">
          Check Camera
        </button>
      </div>
    </div>
  );
};

const MeetingSetup = ({
  setIsSetupComplete,
}: {
  setIsSetupComplete: (value: boolean) => void;
}) => {
  // https://getstream.io/video/docs/react/guides/call-and-participant-state/#call-state
  const { useCallEndedAt, useCallStartsAt } = useCallStateHooks();
  const callStartsAt = useCallStartsAt();
  const callEndedAt = useCallEndedAt();
  const callTimeNotArrived =
    callStartsAt && new Date(callStartsAt) > new Date();
  const callHasEnded = !!callEndedAt;

  const call = useCall();

  if (!call) {
    throw new Error(
      'useStreamCall must be used within a StreamCall component.',
    );
  }

  // https://getstream.io/video/docs/react/ui-cookbook/replacing-call-controls/
  const [isMicCamToggled, setIsMicCamToggled] = useState(false);
  const [displayName, setDisplayName] = useState<string>(() => {
    try {
      return localStorage.getItem('bonggo_display_name') || '';
    } catch (e) {
      return '';
    }
  });

  useEffect(() => {
    if (isMicCamToggled) {
      call.camera.disable();
      call.microphone.disable();
    } else {
      call.camera.enable();
      call.microphone.enable();
    }
  }, [isMicCamToggled, call.camera, call.microphone]);

  if (callTimeNotArrived)
    return (
      <Alert
        title={`Your Meeting has not started yet. It is scheduled for ${callStartsAt.toLocaleString()}`}
      />
    );

  if (callHasEnded)
    return (
      <Alert
        title="The call has been ended by the host"
        iconUrl="/icons/call-ended.svg"
      />
    );

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-3 text-white">
      <h1 className="text-center text-2xl font-bold">Setup</h1>
      <ErrorBoundary>
        <VideoPreview />
      </ErrorBoundary>
      <CameraDiagnostic />
      <div className="mt-4 flex w-full max-w-md flex-col gap-2">
        <label className="text-sm text-sky-2">Your name</label>
        <input
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Enter your display name"
          className="w-full rounded bg-dark-2 px-3 py-2 text-white"
        />
      </div>
      <div className="flex h-16 items-center justify-center gap-3">
        <label className="flex items-center justify-center gap-2 font-medium">
          <input
            type="checkbox"
            checked={isMicCamToggled}
            onChange={(e) => setIsMicCamToggled(e.target.checked)}
          />
          Join with mic and camera off
        </label>
        <DeviceSettings />
      </div>
      <Button
        className="rounded-md bg-green-500 px-4 py-2.5"
        onClick={() => {
          // persist name so other pages and the Stream client can pick it up
          try {
            if (displayName && displayName.trim())
              localStorage.setItem('bonggo_display_name', displayName.trim());
          } catch (e) {}

          call.join();

          // Best-effort: try to update the local participant's metadata
          try {
            // Some SDK builds expose getLocalParticipant().update
            // Use a tolerant approach since API surface may vary
            // @ts-ignore
            const local = call.getLocalParticipant ? call.getLocalParticipant() : null;
            if (local && typeof local.update === 'function') {
              local.update({ name: displayName || 'Anonymous' });
            }
          } catch (e) {
            // ignore
          }

          setIsSetupComplete(true);
        }}
      >
        Join meeting
      </Button>
    </div>
  );
};

export default MeetingSetup;
