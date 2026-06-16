import { create } from 'zustand';

export type RoomId = 'corridor' | 'gallery' | 'studio' | 'contact';

interface ThreeState {
  currentRoom: RoomId;
  enter: (room: RoomId) => void;
  backToCorridor: () => void;
  transition: number; // 0 = 在当前房间,1 = 正在切换
  isIntro: boolean;
  finishIntro: () => void;
}

export const useThreeStore = create<ThreeState>((set) => ({
  currentRoom: 'corridor',
  transition: 0,
  isIntro: true,
  enter: (room) => {
    set({ currentRoom: room, transition: 1 });
    window.setTimeout(() => set({ transition: 0 }), 900);
  },
  backToCorridor: () => {
    set({ transition: 1 });
    window.setTimeout(() => {
      set({ currentRoom: 'corridor', transition: 0 });
    }, 700);
  },
  finishIntro: () => set({ isIntro: false, transition: 1 }),
}));
