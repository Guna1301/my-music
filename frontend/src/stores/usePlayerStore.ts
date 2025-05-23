import { Song } from '@/types';
import { create } from 'zustand';
import { useChatStore } from './useChatStore';

interface PlayerStore {
    currentSong: Song | null;
    isPlaying: boolean;
    queue: Song[];
    currentIndex: number;
    isRepeat: boolean;
    isShuffle: boolean;

    initializeQueue: (songs: Song[]) => void;
    PlayAlbum: (songs: Song[], startIndex?: number) => void;
    setCurrentSong: (song: Song | null) => void;
    togglePlay: () => void;
    playNext: () => void;
    playPrevious: () => void;
    playShuffle: () => void;
    playRepeat: () => void;
    clearQueue: () => void;
    playFromIndex: (index: number) => void;
}

const emitActivity = (activity: string) => {
    const socket = useChatStore.getState().socket;
    if (socket && socket.auth) {
        socket.emit('update_activity', {
            userId: socket.auth.userId,
            activity
        });
    }
};

export const usePlayerStore = create<PlayerStore>((set, get) => ({
    currentSong: null,
    isPlaying: false,
    queue: [],
    currentIndex: -1,
    isRepeat: false,
    isShuffle: false,

    initializeQueue: (songs: Song[]) => {
        if (songs.length === 0) {
            set({
                queue: [],
                currentSong: null,
                currentIndex: -1,
                isPlaying: false
            });
            return;
        }

        set({
            queue: songs,
            currentSong: get().currentSong || songs[0],
            currentIndex: get().currentIndex === -1 ? 0 : get().currentIndex
        });
    },

    PlayAlbum: (songs: Song[], startIndex = 0) => {
        if (songs.length === 0) {
            return;
        }
        const song = songs[startIndex];
        emitActivity(`Playing ${song.title} by ${song.artist}`);

        set({
            queue: songs,
            currentSong: song,
            currentIndex: startIndex,
            isPlaying: true
        });
    },

    setCurrentSong: (song: Song | null) => {
        if (!song) {
            return;
        }

        emitActivity(`Playing ${song.title} by ${song.artist}`);

        const songIndex = get().queue.findIndex((s) => s._id === song._id);

        set({
            currentSong: song,
            isPlaying: true,
            currentIndex: songIndex !== -1 ? songIndex : get().currentIndex
        });
    },

    togglePlay: () => {
        const willStartPlaying = !get().isPlaying;
        const currSong = get().currentSong;

        emitActivity(
            willStartPlaying && currSong
                ? `Playing ${currSong.title} by ${currSong.artist}`
                : 'Idle'
        );

        set({
            isPlaying: willStartPlaying
        });
    },

    playNext: () => {
        const { queue, currentIndex, isRepeat } = get();

        if (queue.length === 0) {
            set({
                isPlaying: false,
                currentSong: null,
                currentIndex: -1
            });
            emitActivity('Idle');
            return;
        }

        if (isRepeat) {
            set({
                currentSong: queue[currentIndex],
                isPlaying: true
            });
            return;
        }

        const nextIndex = (currentIndex + 1) % queue.length;
        const nextSong = queue[nextIndex];

        emitActivity(`Playing ${nextSong.title} by ${nextSong.artist}`);

        set({
            currentSong: nextSong,
            isPlaying: true,
            currentIndex: nextIndex
        });
    },

    playPrevious: () => {
        const { queue, currentIndex } = get();

        if (queue.length === 0) {
            set({
                isPlaying: false,
                currentSong: null,
                currentIndex: -1
            });
            emitActivity('Idle');
            return;
        }

        const prevIndex = (currentIndex - 1 + queue.length) % queue.length;
        const prevSong = queue[prevIndex];

        emitActivity(`Playing ${prevSong.title} by ${prevSong.artist}`);

        set({
            currentSong: prevSong,
            isPlaying: true,
            currentIndex: prevIndex
        });
    },

    playShuffle: () => {
        const { queue, isShuffle } = get();

        if (queue.length === 0) {
            return;
        }

        const shuffledQueue = [...queue].sort(() => Math.random() - 0.5);
        const randomIndex = Math.floor(Math.random() * shuffledQueue.length);
        const song = shuffledQueue[randomIndex];

        emitActivity(`Playing ${song.title} by ${song.artist}`);

        set({
            queue: shuffledQueue,
            currentSong: song,
            currentIndex: randomIndex,
            isPlaying: true,
            isShuffle: !isShuffle
        });
    },

    playRepeat: () => {
        const { isRepeat } = get();
        set({ isRepeat: !isRepeat });
    },

    clearQueue: () => {
        set({
            queue: [],
            currentSong: null,
            currentIndex: -1,
            isPlaying: false
        });
        emitActivity('Idle');
    },

    playFromIndex: (index: number) => {
        const { queue } = get();

        if (index < 0 || index >= queue.length) {
            return;
        }

        const song = queue[index];
        emitActivity(`Playing ${song.title} by ${song.artist}`);

        set({
            currentSong: song,
            isPlaying: true,
            currentIndex: index
        });
    }
}));
