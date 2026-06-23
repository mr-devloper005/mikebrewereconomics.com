import { PageShell } from "@/components/shared/page-shell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Search } from "lucide-react";
import { fetchSiteFeed } from "@/lib/site-connector";
import { buildPostUrl, getPostTaskKey } from "@/lib/task-data";
import { getMockPostsForTask } from "@/lib/mock-posts";
import { SITE_CONFIG } from "@/lib/site-config";

export const revalidate = 3;

const matchText = (value: string, query: string) =>
  value.toLowerCase().includes(query);

const stripHtml = (value: string) => value.replace(/<[^>]*>/g, " ");

const compactText = (value: unknown) => {
  if (typeof value !== "string") return "";
  return stripHtml(value).replace(/\s+/g, " ").trim().toLowerCase();
};

const displayText = (value: unknown, fallback = "") => {
  if (typeof value !== "string") return fallback;
  return stripHtml(value).replace(/\s+/g, " ").trim() || fallback;
};

const truncateText = (value: string, max = 180) => {
  if (value.length <= max) return value;
  return `${value.slice(0, max).trimEnd()}...`;
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string; category?: string; task?: string; master?: string }>;
}) {
  const resolved = (await searchParams) || {};
  const query = (resolved.q || "").trim();
  const normalized = query.toLowerCase();
  const category = (resolved.category || "").trim().toLowerCase();
  const task = (resolved.task || "").trim().toLowerCase();
  const useMaster = resolved.master !== "0";
  const feed = await fetchSiteFeed(
    useMaster ? 1000 : 300,
    useMaster
      ? { fresh: true, category: category || undefined, task: task || undefined }
      : undefined
  );
  const posts =
    feed?.posts?.length
      ? feed.posts
      : useMaster
        ? []
        : SITE_CONFIG.tasks.flatMap((task) => getMockPostsForTask(task.key));

  const filtered = posts.filter((post) => {
    const content = post.content && typeof post.content === "object" ? post.content : {};
    const typeText = compactText((content as any).type);
    if (typeText === "comment") return false;
    const description = compactText((content as any).description);
    const body = compactText((content as any).body);
    const excerpt = compactText((content as any).excerpt);
    const categoryText = compactText((content as any).category);
    const tags = Array.isArray(post.tags) ? post.tags.join(" ") : "";
    const tagsText = compactText(tags);
    const derivedCategory = categoryText || tagsText;
    if (category && !derivedCategory.includes(category)) return false;
    if (task && typeText && typeText !== task) return false;
    if (!normalized.length) return true;
    return (
      matchText(compactText(post.title || ""), normalized) ||
      matchText(compactText(post.summary || ""), normalized) ||
      matchText(description, normalized) ||
      matchText(body, normalized) ||
      matchText(excerpt, normalized) ||
      matchText(tagsText, normalized)
    );
  });

  const results = normalized.length > 0 ? filtered : filtered.slice(0, 24);

  return (
    <PageShell
      title="Search"
      description={
        query
          ? `Results for "${query}"`
          : "Browse the latest posts across every task."
      }
      actions={
        <form action="/search" className="flex w-full gap-2 sm:w-auto">
          <input type="hidden" name="master" value="1" />
          {category ? <input type="hidden" name="category" value={category} /> : null}
          {task ? <input type="hidden" name="task" value={task} /> : null}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              name="q"
              defaultValue={query}
              placeholder="Search across tasks..."
              className="h-11 pl-9"
            />
          </div>
          <Button type="submit" className="h-11 rounded-sm bg-[#333399] px-6 text-white hover:bg-[#2a2a7a]">
            Search
          </Button>
        </form>
      }
    >
      {results.length ? (
        <div className="grid gap-4">
          {results.map((post) => {
            const task = getPostTaskKey(post);
            const href = task ? buildPostUrl(task, post.slug) : `/posts/${post.slug}`;
            const content = post.content && typeof post.content === "object" ? post.content : {};
            const category = displayText((content as any).category || post.tags?.[0], task || "Post");
            const summary = truncateText(
              displayText((content as any).description || (content as any).excerpt || post.summary, "Open this result to read more.")
            );

            return (
              <Link
                key={post.id}
                href={href}
                className="block rounded-md border border-slate-200 bg-white p-5 shadow-sm transition-colors hover:border-[#0d7a7a]/40 hover:bg-slate-50"
              >
                <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0d7a7a]">
                  <span>{category}</span>
                  {task ? <span className="text-slate-300">/</span> : null}
                  {task ? <span className="text-slate-500">{task}</span> : null}
                </div>
                <h2 className="mt-3 text-xl font-semibold leading-snug text-slate-950">{post.title}</h2>
                <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">{summary}</p>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="rounded-md border border-dashed border-slate-300 bg-white/80 p-12 text-center text-sm text-slate-600">
          No matching articles or posts yet. Try another term or use Advanced search from the header.
        </div>
      )}
    </PageShell>
  );
}
