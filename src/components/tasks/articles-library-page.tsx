import Link from "next/link";
import { ArrowRight, BookOpen, Clock, FileText, Layers, Search } from "lucide-react";
import { NavbarShell } from "@/components/shared/navbar-shell";
import { Footer } from "@/components/shared/footer";
import { ContentImage } from "@/components/shared/content-image";
import { TaskListClient } from "@/components/tasks/task-list-client";
import { SchemaJsonLd } from "@/components/seo/schema-jsonld";
import { buildPostUrl, fetchTaskPosts } from "@/lib/task-data";
import { SITE_CONFIG, getTaskConfig } from "@/lib/site-config";
import { CATEGORY_OPTIONS, isValidCategory, normalizeCategory } from "@/lib/categories";
import { taskIntroCopy } from "@/config/site.content";
import type { SitePost } from "@/lib/site-connector";

/** Quick-jump topics surfaced on the library ribbon (subset of full category list). */
const LIBRARY_TOPIC_SLUGS = [
  "finance",
  "news",
  "education",
  "business",
  "law-legal",
  "technology",
  "industry-manufacturing",
  "crypto",
] as const;

const stripHtml = (value?: string | null) =>
  (value || "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<\/?[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const excerpt = (value?: string | null, max = 200) => {
  const text = stripHtml(value);
  if (!text) return "";
  if (text.length <= max) return text;
  return `${text.slice(0, max).trimEnd()}…`;
};

type Listingish = { category?: string; description?: string; body?: string; excerpt?: string; image?: string; images?: unknown[]; logo?: string };

const getContent = (post: SitePost): Listingish => {
  const content = post.content && typeof post.content === "object" ? post.content : {};
  return content as Listingish;
};

const getLeadImageUrl = (post: SitePost, content: Listingish) => {
  const media = Array.isArray(post.media) ? post.media : [];
  const mediaUrl = media[0]?.url;
  if (mediaUrl) return mediaUrl;
  if (typeof content.image === "string" && content.image) return content.image;
  const imgs = Array.isArray(content.images) ? content.images : [];
  const first = imgs.find((v) => typeof v === "string");
  if (first) return first as string;
  if (typeof content.logo === "string" && content.logo) return content.logo;
  return "/placeholder.svg?height=640&width=960";
};

function filterPostsForListView(posts: SitePost[], normalizedCategory: string): SitePost[] {
  if (normalizedCategory === "all") {
    return posts.filter((post) => {
      const content = getContent(post);
      const value = typeof content.category === "string" ? content.category : "";
      return !value || isValidCategory(value);
    });
  }
  return posts.filter((post) => {
    const content = getContent(post);
    const value =
      typeof content.category === "string" ? normalizeCategory(content.category) : "";
    return value === normalizedCategory;
  });
}

function categoryLabel(slug: string) {
  return CATEGORY_OPTIONS.find((c) => c.slug === slug)?.name ?? slug;
}

export async function ArticlesLibraryPage({ category }: { category?: string }) {
  const posts = await fetchTaskPosts("article", 48);
  const normalizedCategory = category ? normalizeCategory(category) : "all";
  const taskConfig = getTaskConfig("article");
  const baseUrl = SITE_CONFIG.baseUrl.replace(/\/$/, "");
  const route = taskConfig?.route || "/articles";
  const intro = taskIntroCopy.article;

  const inView = filterPostsForListView(posts, normalizedCategory);
  const lead = inView[0];
  const leadSlug = lead?.slug;
  const excludeSlugs = leadSlug ? [leadSlug] : undefined;

  const schemaItems = posts.slice(0, 10).map((post, index) => ({
    "@type": "ListItem",
    position: index + 1,
    url: `${baseUrl}${taskConfig?.route || "/articles"}/${post.slug}`,
    name: post.title,
  }));

  const topicChips = LIBRARY_TOPIC_SLUGS.map((slug) => ({
    slug,
    name: categoryLabel(slug),
    href: slug ? `${route}?category=${encodeURIComponent(slug)}` : route,
    active: normalizedCategory === slug,
  }));

  const leadContent = lead ? getContent(lead) : null;
  const leadImage = lead && leadContent ? getLeadImageUrl(lead, leadContent) : "";
  const leadHref = lead ? buildPostUrl("article", lead.slug) : "";
  const leadCategoryRaw = leadContent && typeof leadContent.category === "string" ? leadContent.category : "";
  const leadCategory =
    leadCategoryRaw && isValidCategory(leadCategoryRaw)
      ? categoryLabel(normalizeCategory(leadCategoryRaw))
      : leadCategoryRaw || null;

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fafafa_0%,#f0f0f0_100%)] text-slate-900">
      <NavbarShell />
      <SchemaJsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: `${taskConfig?.label || "Articles"} | ${SITE_CONFIG.name}`,
          url: `${baseUrl}${route}${normalizedCategory !== "all" ? `?category=${encodeURIComponent(normalizedCategory)}` : ""}`,
          description: taskConfig?.description,
          hasPart: schemaItems,
        }}
      />

      <header className="border-b border-slate-800/80 bg-[#1e293b] text-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-teal-200/90">
            <Link href="/" className="transition-colors hover:text-white">
              Home
            </Link>
            <span className="text-slate-500" aria-hidden>
              /
            </span>
            <span className="text-slate-300">Library</span>
            {normalizedCategory !== "all" ? (
              <>
                <span className="text-slate-500" aria-hidden>
                  /
                </span>
                <span className="text-white">{categoryLabel(normalizedCategory)}</span>
              </>
            ) : null}
          </div>

          <div className="mt-6 grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div>
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                <FileText className="h-4 w-4 text-teal-300" aria-hidden />
                Article library
              </p>
              <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
                Economics reading, briefings, and long-form analysis
              </h1>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300">
                Browse by topic, filter the full shelf, or jump into search scoped to articles. The layout keeps
                hierarchy clear: one lead story for your current view, then a dense grid for scanning the rest.
              </p>
              <dl className="mt-8 flex flex-wrap gap-8 text-sm">
                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">In catalog</dt>
                  <dd className="mt-1 text-2xl font-semibold tabular-nums text-white">{posts.length}</dd>
                </div>
                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">In this view</dt>
                  <dd className="mt-1 text-2xl font-semibold tabular-nums text-teal-200">{inView.length}</dd>
                </div>
              </dl>
            </div>

            <form
              className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
              action="/search"
              method="get"
            >
              <input type="hidden" name="task" value="article" />
              <label htmlFor="articles-lib-search" className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                Search articles
              </label>
              <div className="mt-3 flex gap-2">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <input
                    id="articles-lib-search"
                    name="q"
                    type="search"
                    placeholder="Titles, summaries, tags…"
                    className="h-12 w-full rounded-xl border border-white/15 bg-slate-900/40 pl-10 pr-3 text-sm text-white placeholder:text-slate-500 focus:border-teal-400/60 focus:outline-none focus:ring-2 focus:ring-teal-500/25"
                  />
                </div>
                <button
                  type="submit"
                  className="h-12 shrink-0 rounded-xl bg-teal-500 px-5 text-sm font-semibold text-slate-950 transition-colors hover:bg-teal-400"
                >
                  Go
                </button>
              </div>
              <p className="mt-3 text-xs text-slate-500">
                Tip: combine with the category control on the right to teach or present a single topic lane.
              </p>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
        <div className="mb-8 flex flex-col gap-4 border-b border-slate-200/90 pb-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3">
            <Layers className="mt-0.5 h-5 w-5 shrink-0 text-[#0d7a7a]" aria-hidden />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Topics</p>
              <p className="mt-1 text-sm text-slate-600">Jump to common economics-adjacent lanes. All categories stay available in the filter.</p>
            </div>
          </div>
          <nav aria-label="Article topics" className="flex flex-wrap gap-2">
            <Link
              href={route}
              className={`rounded-full border px-4 py-2 text-xs font-semibold transition-colors ${
                normalizedCategory === "all"
                  ? "border-[#333399] bg-[#333399] text-white"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
              }`}
            >
              All
            </Link>
            {topicChips.map(({ slug, name, href, active }) => (
              <Link
                key={slug}
                href={href}
                className={`rounded-full border px-4 py-2 text-xs font-semibold transition-colors ${
                  active
                    ? "border-[#333399] bg-[#333399] text-white"
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                }`}
              >
                {name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mb-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_260px] lg:items-start">
          <div className="min-w-0 space-y-10">
            {lead ? (
              <section aria-labelledby="lead-heading" className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_1px_0_rgba(0,0,0,0.04),0_20px_50px_rgba(15,23,42,0.08)]">
                <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
                  <Link href={leadHref} className="relative block aspect-[16/10] bg-slate-100 lg:aspect-auto lg:min-h-[280px]">
                    <ContentImage
                      src={leadImage}
                      alt={lead.title || "Article cover"}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 55vw"
                      priority
                    />
                  </Link>
                  <div className="flex flex-col justify-center p-8 sm:p-10">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      {leadCategory ? (
                        <span className="rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-700">{leadCategory}</span>
                      ) : null}
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" aria-hidden />
                        Lead for this view
                      </span>
                    </div>
                    <h2 id="lead-heading" className="mt-4 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                      <Link href={leadHref} className="hover:text-[#0d7a7a]">
                        {lead.title}
                      </Link>
                    </h2>
                    <p className="mt-4 text-sm leading-7 text-slate-600">
                      {excerpt(lead.summary || leadContent?.excerpt || leadContent?.description || leadContent?.body)}
                    </p>
                    <Link
                      href={leadHref}
                      className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#333399] hover:text-[#0d7a7a]"
                    >
                      Read full article
                      <ArrowRight className="h-4 w-4" aria-hidden />
                    </Link>
                  </div>
                </div>
              </section>
            ) : null}

            <section id="article-grid" aria-labelledby="grid-heading">
              <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <h2 id="grid-heading" className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                    <BookOpen className="h-5 w-5 text-[#0d7a7a]" aria-hidden />
                    {normalizedCategory === "all" ? "Latest in the library" : `More in ${categoryLabel(normalizedCategory)}`}
                  </h2>
                  <p className="mt-1 text-sm text-slate-600">Cards respect your category filter and any posts saved in this browser.</p>
                </div>
              </div>
              <TaskListClient
                task="article"
                initialPosts={posts}
                category={normalizedCategory}
                excludeSlugs={excludeSlugs}
              />
            </section>
          </div>

          <aside className="space-y-6 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-[0_1px_0_rgba(0,0,0,0.04)] lg:sticky lg:top-24">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Filter shelf</p>
              <p className="mt-2 text-sm text-slate-600">Narrow the same catalog the chips use—ideal for every category, not only the ribbon.</p>
            </div>
            <form className="grid gap-3" action={route} method="get">
              <label className="text-xs font-medium text-slate-700" htmlFor="articles-cat">
                Category
              </label>
              <select
                id="articles-cat"
                name="category"
                defaultValue={normalizedCategory === "all" ? "all" : normalizedCategory}
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 focus:border-[#0d7a7a] focus:outline-none focus:ring-2 focus:ring-[#0d7a7a]/15"
              >
                <option value="all">All categories</option>
                {CATEGORY_OPTIONS.map((item) => (
                  <option key={item.slug} value={item.slug}>
                    {item.name}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="h-11 rounded-xl bg-[#333399] text-sm font-semibold text-white transition-colors hover:bg-[#2a2a7a]"
              >
                Apply filter
              </button>
            </form>
            <div className="border-t border-slate-100 pt-6 text-xs leading-relaxed text-slate-500">
              <p>
                Prefer keyboard flow? Focus the search field in the hero, then tab to topics and the grid below.
              </p>
            </div>
          </aside>
        </div>

        {intro ? (
          <section className="rounded-2xl border border-slate-200/90 bg-white p-8 shadow-[0_18px_50px_rgba(15,23,42,0.06)] sm:p-10">
            <h2 className="text-2xl font-semibold text-slate-900">{intro.title}</h2>
            {intro.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 48)} className="mt-4 text-sm leading-7 text-slate-600">
                {paragraph}
              </p>
            ))}
            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-2 border-t border-slate-200 pt-8 text-sm">
              {intro.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="font-semibold text-slate-900 underline-offset-4 transition-colors hover:text-[#0d7a7a] hover:underline"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </section>
        ) : null}
      </main>
      <Footer />
    </div>
  );
}
