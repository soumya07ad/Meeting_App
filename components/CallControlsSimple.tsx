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
  const [screenShareSupported, setScreenShareSupported] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (!call) return;
    // initialize state from SDK if available
    // @ts-ignore
    if (typeof call.microphone?.isEnabled === 'boolean') setMicEnabled(call.microphone.isEnabled);
    // @ts-ignore
    if (typeof call.camera?.isEnabled === 'boolean') setCamEnabled(call.camera.isEnabled);
    // feature detect screen share support
  // check navigator.getDisplayMedia or common method names on call.screenShare
  const ns = typeof (navigator as any).mediaDevices?.getDisplayMedia === 'function';
  // @ts-ignore - check for known method names without asserting types
  const csStart = call?.screenShare && (typeof (call.screenShare as any).start === 'function' || typeof (call.screenShare as any).startScreenShare === 'function' || typeof (call.screenShare as any).publish === 'function');
  setScreenShareSupported(Boolean(ns || csStart));
    setIsMobile(/Mobi|Android/i.test(navigator.userAgent || ''));
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
        size="sm"
        aria-label={micEnabled ? 'Mute microphone' : 'Unmute microphone'}
        className={`${micEnabled ? 'bg-emerald-600' : 'bg-slate-700'} rounded-full p-2`}
      >
        {micEnabled ? <Mic size={14} /> : <MicOff size={14} />}
      </Button>
      <Button
        onClick={toggleCam}
        size="sm"
        aria-label={camEnabled ? 'Turn camera off' : 'Turn camera on'}
        className={`${camEnabled ? 'bg-emerald-600' : 'bg-slate-700'} rounded-full p-2`}
      >
        {camEnabled ? <Video size={14} /> : <VideoOff size={14} />}
      </Button>
      <Button
        onClick={toggleScreenShare}
        size="sm"
        aria-label={isSharing ? 'Stop screen share' : 'Share screen'}
        disabled={!screenShareSupported}
        title={!screenShareSupported ? 'Screen share not supported in this browser' : isMobile ? 'Screen share may be limited on some mobile browsers' : ''}
        className={`${isSharing ? 'bg-emerald-600' : 'bg-slate-700'} rounded-full p-2 ${!screenShareSupported ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isSharing ? <Monitor size={14} /> : <Share2 size={14} />}
      </Button>
      <div className="ml-1">
        <LeaveButton />
      </div>
    </div>
  );
};

export default CallControlsSimple;
