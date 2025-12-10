export type SoundType = "notification" | "completed" | "error";

const soundMap: Record<SoundType, string> = {
  notification: "/sounds/notification.mp3",
  completed: "/sounds/completed.mp3",
  error: "/sounds/notification.mp3",
};

export const playSound = (type: SoundType, volume: number = 0.5) => {
  try {
    const audio = new Audio(soundMap[type]);
    audio.volume = volume;
    audio.play().catch((error) => {
      console.error("Error playing sound:", error);
    });
  } catch (error) {
    console.error("Error creating audio:", error);
  }
};

// Play notification with custom duration
export const playSoundWithFallback = (
  type: SoundType,
  volume: number = 0.5,
  duration: number = 1000
) => {
  try {
    const audio = new Audio(soundMap[type]);
    audio.volume = volume;

    const playPromise = audio.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setTimeout(() => {
            audio.pause();
            audio.currentTime = 0;
          }, duration);
        })
        .catch((error) => {
          console.error("Audio playback failed:", error);
        });
    }
  } catch (error) {
    console.error("Error creating audio:", error);
  }
};