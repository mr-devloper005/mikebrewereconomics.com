"use client";

import { useEffect, useMemo, useState } from "react";
import { MessageSquare, Trash2, Send, Clock, Heart, User as UserIcon } from "lucide-react";
import type { SitePost } from "@/lib/site-connector";
import { RichContent, formatRichHtml } from "@/components/shared/rich-content";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { loadFromStorage, saveToStorage, storageKeys } from "@/lib/local-storage";
import type { User } from "@/types";

const API_BASE =
  process.env.NEXT_PUBLIC_MASTER_PANEL_URL ||
  process.env.NEXT_PUBLIC_MASTER_API_URL;
const SITE_CODE = process.env.NEXT_PUBLIC_SITE_CODE;
const LOCAL_COMMENT_VERSION = "v2";
const DAILY_COMMENT_LIMIT = 10;

type LocalComment = {
  id: string;
  slug: string;
  articleSlug: string;
  authorName: string;
  body: string;
  createdAt: string;
  source: "local";
};

type DisplayComment = {
  id: string;
  slug: string;
  authorName: string;
  body: string;
  createdAt: string;
  source: "local" | "remote";
};

const buildPublicUrl = (path: string) => {
  if (!API_BASE || !SITE_CODE) return null;
  return `${API_BASE.replace(/\/$/, "")}/api/v1/public/${SITE_CODE}${path}`;
};

const getContent = (post: SitePost) =>
  post.content && typeof post.content === "object" ? (post.content as Record<string, any>) : {};

const commentStorageKey = (slug: string) => `nexus-article-comments:${LOCAL_COMMENT_VERSION}:${slug}`;

const startOfToday = () => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date.getTime();
};

const nextResetTime = () => {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  date.setHours(0, 0, 0, 0);
  return date;
};

const getLocalAuthorName = () => {
  const savedUser = loadFromStorage<User | null>(storageKeys.user, null);
  return savedUser?.name?.trim() || "User";
};

const toDisplayComment = (comment: SitePost): DisplayComment => {
  const content = getContent(comment);
  return {
    id: comment.id,
    slug: comment.slug,
    authorName: comment.authorName || "Anonymous",
    body:
      (typeof content.description === "string" && content.description) ||
      comment.summary ||
      "Comment added.",
    createdAt: comment.publishedAt || comment.createdAt || new Date().toISOString(),
    source: "remote",
  };
};

const sortComments = (comments: DisplayComment[]) =>
  [...comments].sort((a, b) => {
    if (a.source !== b.source) {
      return a.source === "local" ? -1 : 1;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

export function ArticleComments({ slug }: { slug: string }) {
  const [remoteComments, setRemoteComments] = useState<DisplayComment[]>([]);
  const [localComments, setLocalComments] = useState<LocalComment[]>([]);
  const [page, setPage] = useState(1);
  const [highlightId, setHighlightId] = useState<string | null>(null);
  const [commentBody, setCommentBody] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const pageSize = 10;

  useEffect(() => {
    const saved = loadFromStorage<LocalComment[]>(commentStorageKey(slug), []);
    setLocalComments(Array.isArray(saved) ? saved : []);
  }, [slug]);

  useEffect(() => {
    const load = async () => {
      const target = buildPublicUrl("/feed?limit=200");
      if (!target) {
        setRemoteComments([]);
        return;
      }

      try {
        const response = await fetch(target, { cache: "no-store" });
        if (!response.ok) {
          setRemoteComments([]);
          return;
        }
        const json = (await response.json()) as { data?: { posts?: SitePost[] } };
        const posts = json.data?.posts || [];
        const filtered = posts.filter((post) => {
          const content = getContent(post);
          return (
            content.type === "comment" &&
            (content.articleSlug === slug ||
              (typeof content.parentUrl === "string" && content.parentUrl.includes(`/${slug}`)))
          );
        });

        setRemoteComments(filtered.map(toDisplayComment));
      } catch {
        setRemoteComments([]);
      }
    };

    load();
  }, [slug]);

  const mergedComments = useMemo(
    () =>
      sortComments([
        ...localComments.map((comment) => ({
          id: comment.id,
          slug: comment.slug,
          authorName: comment.authorName,
          body: comment.body,
          createdAt: comment.createdAt,
          source: "local" as const,
        })),
        ...remoteComments,
      ]),
    [localComments, remoteComments]
  );

  const commentsToday = useMemo(() => {
    const todayStart = startOfToday();
    return localComments.filter((comment) => new Date(comment.createdAt).getTime() >= todayStart).length;
  }, [localComments]);

  const remainingToday = Math.max(DAILY_COMMENT_LIMIT - commentsToday, 0);
  const limitReached = remainingToday <= 0;
  const resetLabel = nextResetTime().toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.startsWith("#comment-")) {
      const targetKey = hash.replace("#comment-", "");
      const match = mergedComments.find(
        (item) => item.id === targetKey || item.slug === targetKey
      );
      setHighlightId(match?.id || null);
      return;
    }

    if (hash === "#comment" && mergedComments.length) {
      setHighlightId(mergedComments[0].id);
      return;
    }

    setHighlightId(null);
  }, [mergedComments]);

  useEffect(() => {
    if (!highlightId) return;
    const target = document.getElementById(`comment-${highlightId}`);
    if (target) {
      setTimeout(() => target.scrollIntoView({ behavior: "smooth", block: "start" }), 150);
    }
  }, [highlightId]);

  const totalPages = Math.max(Math.ceil(mergedComments.length / pageSize), 1);
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const visibleComments = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return mergedComments.slice(start, start + pageSize);
  }, [mergedComments, safePage]);

  const persistLocalComments = (nextComments: LocalComment[]) => {
    setLocalComments(nextComments);
    saveToStorage(commentStorageKey(slug), nextComments);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cleanBody = commentBody.trim();

    if (!cleanBody) {
      setFormError("Please write a comment before publishing.");
      return;
    }

    if (limitReached) {
      setFormError("You have reached the 10 comments per day limit on this device.");
      return;
    }

    const nextComment: LocalComment = {
      id: `local-${slug}-${Date.now()}`,
      slug: `local-comment-${Date.now()}`,
      articleSlug: slug,
      authorName: getLocalAuthorName(),
      body: cleanBody,
      createdAt: new Date().toISOString(),
      source: "local",
    };

    persistLocalComments([nextComment, ...localComments]);
    setCommentBody("");
    setFormError(null);
    setHighlightId(nextComment.id);
    setPage(1);
  };

  const handleDeleteLocalComment = (commentId: string) => {
    const nextComments = localComments.filter((comment) => comment.id !== commentId);
    persistLocalComments(nextComments);
    if (highlightId === commentId) {
      setHighlightId(null);
    }
    setFormError(null);
  };

  return (
    <section className="mt-12" id="comments">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-100">
          <MessageSquare className="h-5 w-5 text-teal-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Discussion</h3>
          <p className="text-sm text-muted-foreground">Share your thoughts and insights</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mb-8 rounded-2xl border border-slate-200/60 bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200">
              <UserIcon className="h-4 w-4 text-slate-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{getLocalAuthorName()}</p>
              <p className="text-xs text-muted-foreground">Commenting as</p>
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="comment-body" className="text-sm font-medium text-foreground">
              Share your perspective
            </label>
            <Textarea
              id="comment-body"
              value={commentBody}
              onChange={(event) => setCommentBody(event.target.value)}
              placeholder="What are your thoughts on this analysis? Share insights, ask questions, or provide additional context..."
              className="min-h-24 border-slate-200 bg-white focus:border-teal-500 focus:ring-teal-500/20"
              maxLength={2000}
              disabled={limitReached}
            />
          </div>
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium ${
                limitReached
                  ? "bg-red-100 text-red-700"
                  : remainingToday <= 3
                    ? "bg-amber-100 text-amber-700"
                    : "bg-teal-100 text-teal-700"
              }`}
            >
              <Clock className="h-3 w-3" />
              {limitReached
                ? `Daily limit reached (${DAILY_COMMENT_LIMIT}/${DAILY_COMMENT_LIMIT})`
                : `${remainingToday} comments remaining today`}
            </div>
            <p className="text-xs text-muted-foreground">
              {limitReached
                ? `Resets at ${resetLabel}`
                : `Resets at ${resetLabel}`}
            </p>
          </div>
          <Button 
            type="submit" 
            disabled={limitReached}
            className="bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300"
          >
            <Send className="mr-2 h-4 w-4" />
            Post Comment
          </Button>
        </div>
        {formError ? (
          <div className="mt-4 rounded-lg bg-red-50 border border-red-200 p-3">
            <p className="text-sm text-red-700">{formError}</p>
          </div>
        ) : null}
      </form>

      {mergedComments.length ? (
        <div className="space-y-4">
          {visibleComments.map((comment) => {
            const isHighlighted = highlightId === comment.id;
            return (
              <div
                key={comment.id}
                id={`comment-${comment.id}`}
                className={`group rounded-2xl border p-5 transition-all ${
                  isHighlighted 
                    ? "border-teal-500/50 bg-teal-50/50 shadow-sm" 
                    : "border-slate-200/60 bg-white hover:border-slate-300/80 hover:shadow-sm"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100">
                      <UserIcon className="h-4 w-4 text-slate-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-foreground">{comment.authorName}</p>
                        {comment.source === "local" && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                            <Heart className="h-3 w-3" />
                            Local
                          </span>
                        )}
                      </div>
                      <div className="mt-1">
                        <RichContent
                          html={formatRichHtml(comment.body, "Comment added.")}
                          className="text-sm text-slate-700 prose-sm prose-h2:text-xl prose-h3:text-lg prose-p:leading-relaxed"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {comment.source === "local" ? (
                      <button
                        type="button"
                        onClick={() => handleDeleteLocalComment(comment.id)}
                        className="opacity-0 transition-opacity group-hover:opacity-100 inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-400 hover:border-red-300 hover:bg-red-50 hover:text-red-600"
                        aria-label="Delete local comment"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-200 mx-auto mb-4">
            <MessageSquare className="h-6 w-6 text-slate-500" />
          </div>
          <h4 className="text-base font-medium text-slate-900 mb-2">Start the conversation</h4>
          <p className="text-sm text-slate-600">Be the first to share your thoughts on this analysis.</p>
        </div>
      )}

      {totalPages > 1 ? (
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200/60 bg-slate-50 p-4">
          <div className="text-sm text-slate-600">
            Showing <span className="font-medium text-slate-900">{(safePage - 1) * pageSize + 1}-{Math.min(safePage * pageSize, mergedComments.length)}</span> of <span className="font-medium text-slate-900">{mergedComments.length}</span> comments
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={safePage === 1}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
            >
              ← Previous
            </button>
            <button
              type="button"
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={safePage === totalPages}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
            >
              Next →
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
