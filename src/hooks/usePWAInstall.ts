import { useState, useEffect } from "react";

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setIsInstallable(false);
      setIsInstalled(true);
      if (typeof (window as any).gtag === "function") {
        (window as any).gtag("event", "pwa_installed", {
          event_category: "Engagement",
          event_label: "Installed App",
        });
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
      // Optional: Track if they launch the app from the home screen
      if (typeof (window as any).gtag === "function" && !sessionStorage.getItem("tracked_pwa_open")) {
        (window as any).gtag("event", "pwa_opened", {
          event_category: "Engagement",
          event_label: "Opened via Home Screen",
        });
        sessionStorage.setItem("tracked_pwa_open", "true");
      }
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const promptInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setDeferredPrompt(null);
      setIsInstallable(false);
      
      // Some browsers don't fire 'appinstalled' reliably, so tracking the prompt acceptance is a good fallback
      if (typeof (window as any).gtag === "function") {
        (window as any).gtag("event", "pwa_install_accepted", {
          event_category: "Engagement",
          event_label: "Accepted Install Prompt",
        });
      }
    }
  };

  return { isInstallable, isInstalled, promptInstall };
}
