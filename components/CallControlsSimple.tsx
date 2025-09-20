"use client";

import { useState, useEffect } from 'react';
import { useCall } from '@stream-io/video-react-sdk';
import { Button } from './ui/button';
import LeaveButton from './LeaveButton';
import { Mic, MicOff, Video, VideoOff, Monitor, Share2 } from 'lucide-react';

const CallControlsSimple = () => {
  const call = useCall();
  const [micEnabled, setMicEnabled] = useState(true);
  const [camEnabled, setCamEnabled] = useState(true);
  const [isSharing, setIsSharing] = useState(false);

  useEffect(() => {
    if (!call) return;
    // initialize state from SDK if available
    // @ts-ignore
    if (typeof call.microphone?.isEnabled === 'boolean') setMicEnabled(call.microphone.isEnabled);
    // @ts-ignore
    if (typeof call.camera?.isEnabled === 'boolean') setCamEnabled(call.camera.isEnabled);
  }, [call]);

  const toggleMic = async () => {
    if (!call) return;
    try {
      if (micEnabled) {
        // @ts-ignore
        if (typeof call.microphone?.disable === 'function') await call.microphone.disable();
        setMicEnabled(false);
      } else {
        // @ts-ignore
        if (typeof call.microphone?.enable === 'function') await call.microphone.enable();
        setMicEnabled(true);
      }
    } catch (e) {
      // ignore
    }
  };

  const toggleCam = async () => {
    if (!call) return;
    try {
      if (camEnabled) {
        // @ts-ignore
        if (typeof call.camera?.disable === 'function') await call.camera.disable();
        setCamEnabled(false);
      } else {
        // @ts-ignore
        if (typeof call.camera?.enable === 'function') await call.camera.enable();
        setCamEnabled(true);
      }
    } catch (e) {
      // ignore
    }
  };

  const toggleScreenShare = async () => {
    if (!call) return;
    try {
      // try stop paths
      // @ts-ignore
      if (isSharing) {
        // @ts-ignore
        if (typeof call.screenShare?.stop === 'function') await call.screenShare.stop();
        // @ts-ignore
        else if (typeof call.screenShare?.stopScreenShare === 'function') await call.screenShare.stopScreenShare();
        setIsSharing(false);
        return;
      }

      // try start paths
      // @ts-ignore
      if (typeof call.screenShare?.start === 'function') {
        // @ts-ignore
        await call.screenShare.start();
        setIsSharing(true);
        return;
      }
      // @ts-ignore
      if (typeof call.screenShare?.startScreenShare === 'function') {
        // @ts-ignore
        await call.screenShare.startScreenShare();
        setIsSharing(true);
        return;
      }

      // fallback to getDisplayMedia and publish
      if (typeof (navigator as any).mediaDevices?.getDisplayMedia === 'function') {
        // eslint-disable-next-line
        const stream = await (navigator as any).mediaDevices.getDisplayMedia({ video: true });
        // @ts-ignore
        if (typeof call.screenShare?.publish === 'function') await call.screenShare.publish(stream);
        setIsSharing(true);
      }
    } catch (e) {
      // ignore
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={toggleMic}
        className={`${micEnabled ? 'bg-emerald-600' : 'bg-slate-700'} flex items-center gap-2`}
      >
        {micEnabled ? <Mic size={16} /> : <MicOff size={16} />}
        <span className="sr-only">{micEnabled ? 'Mute' : 'Unmute'}</span>
      </Button>
      <Button
        onClick={toggleCam}
        className={`${camEnabled ? 'bg-emerald-600' : 'bg-slate-700'} flex items-center gap-2`}
      >
        {camEnabled ? <Video size={16} /> : <VideoOff size={16} />}
        <span className="sr-only">{camEnabled ? 'Turn camera off' : 'Turn camera on'}</span>
      </Button>
      <Button
        onClick={toggleScreenShare}
        className={`${isSharing ? 'bg-emerald-600' : 'bg-slate-700'} flex items-center gap-2`}
      >
        {isSharing ? <Monitor size={16} /> : <Share2 size={16} />}
        <span className="sr-only">{isSharing ? 'Stop screen share' : 'Share screen'}</span>
      </Button>
      <LeaveButton />
    </div>
  );
};

export default CallControlsSimple;
