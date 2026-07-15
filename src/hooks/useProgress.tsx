import { create } from "zustand";
import {
  loadProfiles,
  saveProfiles,
  withDailyStreak,
  type UserProgress,
  type Profile,
  type ProfilesState
} from "../lib/progress";

interface ProgressStore {
  // Global state
  state: ProfilesState;
  
  // Helpers for current profile
  progress: UserProgress; // Computed dynamically
  activeProfile: Profile;
  
  // Actions
  updateProgress: (updater: (p: UserProgress) => UserProgress) => void;
  touchDailyStreak: () => void;
  
  // Profile management
  switchProfile: (id: string) => void;
  addProfile: (name: string, avatar: string) => void;
  deleteProfile: (id: string) => void;
}

function deriveState(state: ProfilesState) {
  return {
    state,
    activeProfile: state.profiles[state.activeProfileId],
    progress: state.profiles[state.activeProfileId].progress
  };
}

export const useProgress = create<ProgressStore>((set) => {
  const initialState = loadProfiles();
  
  return {
    ...deriveState(initialState),
    
    updateProgress: (updater) => {
      set((store) => {
        const nextProgress = updater(store.state.profiles[store.state.activeProfileId].progress);
        const nextState = {
          ...store.state,
          profiles: {
            ...store.state.profiles,
            [store.state.activeProfileId]: {
              ...store.state.profiles[store.state.activeProfileId],
              progress: nextProgress
            }
          }
        };
        saveProfiles(nextState);
        return deriveState(nextState);
      });
    },
    
    touchDailyStreak: () => {
      set((store) => {
        const nextProgress = withDailyStreak(store.state.profiles[store.state.activeProfileId].progress);
        const nextState = {
          ...store.state,
          profiles: {
            ...store.state.profiles,
            [store.state.activeProfileId]: {
              ...store.state.profiles[store.state.activeProfileId],
              progress: nextProgress
            }
          }
        };
        saveProfiles(nextState);
        return deriveState(nextState);
      });
    },
    
    switchProfile: (id) => {
      set((store) => {
        if (!store.state.profiles[id]) return store;
        const nextState = { ...store.state, activeProfileId: id };
        saveProfiles(nextState);
        return deriveState(nextState);
      });
    },
    
    addProfile: (name, avatar) => {
      set((store) => {
        const id = Math.random().toString(36).substring(2, 9);
        const nextState = {
          ...store.state,
          activeProfileId: id,
          profiles: {
            ...store.state.profiles,
            [id]: { id, name, avatar, progress: { ...store.state.profiles["default"].progress, lettersLearned:0, numbersLearned:0, catProgress:{}, starsTotal:0, streakDays:0, lastSeen:"" } } // empty progress
          }
        };
        saveProfiles(nextState);
        return deriveState(nextState);
      });
    },
    
    deleteProfile: (id) => {
      set((store) => {
        const profileKeys = Object.keys(store.state.profiles);
        if (profileKeys.length <= 1) return store; // don't delete last profile
        
        const newProfiles = { ...store.state.profiles };
        delete newProfiles[id];
        
        const nextActive = store.state.activeProfileId === id ? Object.keys(newProfiles)[0] : store.state.activeProfileId;
        
        const nextState = { activeProfileId: nextActive, profiles: newProfiles };
        saveProfiles(nextState);
        return deriveState(nextState);
      });
    }
  };
});

/** "1 Day" / "12 Days" — shared streak label formatting. */
export function formatStreak(days: number): string {
  return `${days} ${days === 1 ? "Day" : "Days"}`;
}
