import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useCommentStore } from "@/modules/comments/hooks";

const t = (key: string) => key;
vi.mock("@/integrations/i18n", () => ({ useTranslation: () => ({ t }) }));

vi.mock("@/apis/comments", () => ({
  getCommentList: vi.fn().mockResolvedValue({ configured: false, comments: [] }),
  createComment: vi.fn(),
  createReply: vi.fn(),
  deleteComment: vi.fn(),
  getReplyList: vi.fn(),
  setCommentResolved: vi.fn(),
}));

afterEach(() => localStorage.clear());

describe("landing-page/AC-11: pins survive a reload without GITHUB_TOKEN", () => {
  it("saves a pin on the H1 to localStorage and loads it back in a fresh store", async () => {
    const first = renderHook(() => useCommentStore(true));
    await waitFor(() => expect(first.result.current.mode).toBe("local"));

    await act(async () => {
      await first.result.current.add({
        route: "/",
        selector: "h1",
        x: 0.5,
        y: 0.5,
        text: "Tighten this headline",
      });
    });
    expect(first.result.current.comments).toHaveLength(1);
    first.unmount();

    const reloaded = renderHook(() => useCommentStore(true));
    await waitFor(() => expect(reloaded.result.current.mode).toBe("local"));
    expect(reloaded.result.current.comments).toMatchObject([
      { route: "/", selector: "h1", text: "Tighten this headline" },
    ]);
  });
});
