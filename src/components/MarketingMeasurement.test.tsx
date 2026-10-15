import { StrictMode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, useNavigate } from "react-router";
import { MarketingMeasurement } from "./MarketingMeasurement";
import { sendMarketingEvent } from "@/lib/marketingAnalytics";

vi.mock("@/lib/marketingAnalytics", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/marketingAnalytics")>()),
  sendMarketingEvent: vi.fn(),
}));
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  window.history.replaceState(null, "", "/");
});

function Navigation() {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => {
        window.history.pushState(null, "", "/play");
        navigate("/play");
      }}
    >
      Enter Play
    </button>
  );
}

describe("marketing route lifecycle", () => {
  it("deduplicates StrictMode visits, counts CTA clicks and stops on entry to Play", () => {
    window.history.replaceState(null, "", "/");
    render(
      <StrictMode>
        <MemoryRouter>
          <MarketingMeasurement />
          <Navigation />
          <header>
            <a onClick={(event) => event.preventDefault()} href="/play">
              Play online
            </a>
          </header>
          <a
            onClick={(event) => event.preventDefault()}
            href="https://play.google.com/store/apps/details?id=com.learnfunkids.app"
          >
            Google Play
          </a>
        </MemoryRouter>
      </StrictMode>,
    );
    expect(sendMarketingEvent).toHaveBeenCalledTimes(1);
    expect(sendMarketingEvent).toHaveBeenCalledWith("pageview", "/");
    fireEvent.click(screen.getByText("Play online"));
    expect(sendMarketingEvent).toHaveBeenLastCalledWith("play_online_clicked", "/", "header");
    const store = screen.getByText("Google Play");
    expect(store).toHaveAttribute("href", expect.stringContaining("utm_campaign=homepage"));
    fireEvent.click(store);
    expect(sendMarketingEvent).toHaveBeenLastCalledWith("google_play_clicked", "/", "content");
    fireEvent.click(screen.getByText("Enter Play"));
    vi.mocked(sendMarketingEvent).mockClear();
    fireEvent.click(store);
    expect(sendMarketingEvent).not.toHaveBeenCalled();
  });
  it("does not track a direct Play route", () => {
    window.history.replaceState(null, "", "/play/parent");
    render(
      <MemoryRouter initialEntries={["/play/parent"]}>
        <MarketingMeasurement />
        <a onClick={(event) => event.preventDefault()} href="/play">
          Home
        </a>
      </MemoryRouter>,
    );
    fireEvent.click(screen.getByText("Home"));
    expect(sendMarketingEvent).not.toHaveBeenCalled();
  });
});
