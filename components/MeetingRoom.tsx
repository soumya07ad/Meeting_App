'use client';
import { useState } from 'react';
import {
  CallParticipantsList,
  CallStatsButton,
  CallingState,
  PaginatedGridLayout,
  SpeakerLayout,
  useCallStateHooks,
} from '@stream-io/video-react-sdk';
import { useRouter, useSearchParams } from 'next/navigation';
import { Users, LayoutList, MoreHorizontal } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import Loader from './Loader';
import EndCallButton from './EndCallButton';
import CallControlsSimple from './CallControlsSimple';
import { cn } from '@/lib/utils';

type CallLayoutType = 'grid' | 'speaker-left' | 'speaker-right';

const MeetingRoom = () => {
  const searchParams = useSearchParams();
  const isPersonalRoom = !!searchParams.get('personal');
  const router = useRouter();
  const [layout, setLayout] = useState<CallLayoutType>('speaker-left');
  const [showParticipants, setShowParticipants] = useState(false);
  const { useCallCallingState } = useCallStateHooks();

  // for more detail about types of CallingState see: https://getstream.io/video/docs/react/ui-cookbook/ringing-call/#incoming-call-panel
  const callingState = useCallCallingState();

  if (callingState !== CallingState.JOINED) return <Loader />;

  const CallLayout = () => {
    switch (layout) {
      case 'grid':
        return <PaginatedGridLayout />;
      case 'speaker-right':
        return <SpeakerLayout participantsBarPosition="left" />;
      default:
        return <SpeakerLayout participantsBarPosition="right" />;
    }
  };

  return (
    <section className="relative h-screen w-full overflow-hidden pt-4 text-white">
      <div className="relative flex size-full items-center justify-center">
        <div className=" flex size-full max-w-[1000px] items-center">
          <CallLayout />
        </div>
        <div
          className={cn('h-[calc(100vh-86px)] hidden ml-2', {
            'show-block': showParticipants,
          })}
        >
          <CallParticipantsList onClose={() => setShowParticipants(false)} />
        </div>
      </div>
      {/* video layout and call controls */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex w-full items-center justify-center p-3">
        {/* responsive toolbar: centers on desktop, scrollable and compact on mobile */}
        <div className="flex items-center gap-3 overflow-x-auto rounded-md bg-transparent px-2">
          <CallControlsSimple />
        </div>

        <div className="ml-4 flex items-center gap-2">
          <DropdownMenu>
            <div className="flex items-center">
              <DropdownMenuTrigger className="cursor-pointer rounded-full bg-[#19232d] p-2 hover:bg-[#4c535b]">
                <MoreHorizontal size={18} className="text-white" />
              </DropdownMenuTrigger>
            </div>
            <DropdownMenuContent className="border-dark-1 bg-dark-1 text-white">
              <div className="px-2 py-1 text-xs text-slate-400">Layout</div>
              {['Grid', 'Speaker-Left', 'Speaker-Right'].map((item, index) => (
                <div key={index}>
                  <DropdownMenuItem
                    onClick={() => setLayout(item.toLowerCase() as CallLayoutType)}
                  >
                    {item}
                  </DropdownMenuItem>
                </div>
              ))}
              <DropdownMenuSeparator className="border-dark-1" />
              <div className="px-2 py-1">
                <CallStatsButton />
              </div>
              <DropdownMenuItem onClick={() => setShowParticipants((prev) => !prev)}>
                Toggle participants
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="ml-2">
          {/* Small icon-only end-call button (force visible for testing) */}
          {!isPersonalRoom && <EndCallButton forceShow={true} />}
        </div>
      </div>
    </section>
  );
};

export default MeetingRoom;
