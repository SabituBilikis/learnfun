import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { BlogHubPage, OfflineLearningArticlePage } from "./BlogPages";
import articles from "./articles.json";

afterEach(cleanup);

describe("Parent blog", () => {
  it("lists a real article in the hub", () => {
    render(
      <MemoryRouter>
        <BlogHubPage />
      </MemoryRouter>,
    );
    expect(screen.getByRole("link", { name: articles[0].title })).toHaveAttribute(
      "href",
      "/blog/offline-learning-apps-for-toddlers",
    );
  });

  it("renders advice, disclosure, sources and metadata without entering Play", () => {
    const previousTitle = document.title;
    const { unmount } = render(
      <MemoryRouter>
        <OfflineLearningArticlePage />
      </MemoryRouter>,
    );
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(articles[0].title);
    expect(
      screen.getByRole("heading", { name: "Try this before leaving home" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/we did not conduct independent device testing/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "offline help page" })).toHaveAttribute(
      "href",
      expect.stringContaining("khankids.zendesk.com"),
    );
    expect(document.title).toBe(articles[0].seoTitle);
    expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://learnfunkids.vercel.app/blog/offline-learning-apps-for-toddlers",
    );
    const schemas = document.querySelectorAll("script[data-blog-schema]");
    expect(schemas).toHaveLength(1);
    expect(JSON.parse(schemas[0].textContent!)["@type"]).toBe("Article");
    unmount();
    expect(document.title).toBe(previousTitle);
    expect(document.querySelector("script[data-blog-schema]")).toBeNull();
  });
});
