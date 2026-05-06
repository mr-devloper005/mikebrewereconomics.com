import Link from "next/link";
import { ArrowRight, BookOpen, Clock, FileText, Layers, Search, TrendingUp, BarChart3, Newspaper, Sparkles, Filter, ChevronRight } from "lucide-react";
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
    <div className="min-h-screen bg-[#f8fafc] text-slate-900">
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

      <header className="relative overflow-hidden bg-[#0f172a] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(13,148,136,0.15)_0%,_transparent_50%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
            <Link href="/" className="transition-colors hover:text-teal-300">
              Home
            </Link>
            <ChevronRight className="h-3 w-3 text-slate-600" aria-hidden />
            <span className="text-slate-300">Articles</span>
            {normalizedCategory !== "all" ? (
              <>
                <ChevronRight className="h-3 w-3 text-slate-600" aria-hidden />
                <span className="text-teal-300">{categoryLabel(normalizedCategory)}</span>
              </>
            ) : null}
          </div>

          <div className="mt-8 grid gap-12 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-teal-400">
                <Newspaper className="h-4 w-4" aria-hidden />
                <span>Economics & Finance Insights</span>
              </div>
              <h1 className="mt-5 max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Market Intelligence & Analysis
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-400">
                Deep-dive briefings, economic forecasts, and data-driven analysis from industry experts. 
                Stay ahead with curated insights across markets, policy, and global trends.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-500/20">
                    <BarChart3 className="h-5 w-5 text-teal-400" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-white">{posts.length}+</p>
                    <p className="text-xs text-slate-400">Articles Published</p>
                  </div>
                </div>
                <div className="h-8 w-px bg-slate-700" />
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-500/20">
                    <TrendingUp className="h-5 w-5 text-teal-400" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-white">{inView.length}</p>
                    <p className="text-xs text-slate-400">In Current View</p>
                  </div>
                </div>
                <div className="h-8 w-px bg-slate-700" />
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-500/20">
                    <Sparkles className="h-5 w-5 text-teal-400" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-white">Weekly</p>
                    <p className="text-xs text-slate-400">Fresh Updates</p>
                  </div>
                </div>
              </div>
            </div>

            <form
              className="w-full max-w-md rounded-2xl border border-slate-700/50 bg-slate-800/50 p-6 backdrop-blur-sm lg:w-96"
              action="/search"
              method="get"
            >
              <input type="hidden" name="task" value="article" />
              <label htmlFor="articles-lib-search" className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                <Search className="h-3.5 w-3.5" />
                Find articles
              </label>
              <div className="mt-4 flex gap-2">
                <div className="relative flex-1">
                  <input
                    id="articles-lib-search"
                    name="q"
                    type="search"
                    placeholder="Search topics, authors, tags..."
                    className="h-12 w-full rounded-xl border border-slate-600/50 bg-slate-900/60 px-4 text-sm text-white placeholder:text-slate-500 focus:border-teal-500/60 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  />
                </div>
                <button
                  type="submit"
                  className="h-12 shrink-0 rounded-xl bg-teal-500 px-6 text-sm font-semibold text-slate-900 transition-all hover:bg-teal-400 hover:shadow-lg hover:shadow-teal-500/25"
                >
                  Search
                </button>
              </div>
              <p className="mt-3 text-xs text-slate-500">
                Try searching for "inflation", "GDP", or specific markets
              </p>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-4 w-4 text-teal-600" aria-hidden />
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Browse by Topic</p>
          </div>
          <nav aria-label="Article topics" className="flex flex-wrap gap-2">
            <Link
              href={route}
              className={`rounded-lg px-5 py-2.5 text-sm font-medium transition-all ${
                normalizedCategory === "all"
                  ? "bg-teal-600 text-white shadow-md shadow-teal-500/25"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-teal-300 hover:text-teal-600"
              }`}
            >
              All Articles
            </Link>
            {topicChips.map(({ slug, name, href, active }) => (
              <Link
                key={slug}
                href={href}
                className={`rounded-lg px-5 py-2.5 text-sm font-medium transition-all ${
                  active
                    ? "bg-teal-600 text-white shadow-md shadow-teal-500/25"
                    : "bg-white text-slate-600 border border-slate-200 hover:border-teal-300 hover:text-teal-600"
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
              <section aria-labelledby="lead-heading" className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/60 transition-all hover:shadow-lg hover:shadow-slate-900/5 hover:ring-teal-500/20">
                <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
                  <Link href={leadHref} className="relative block aspect-[16/10] overflow-hidden bg-slate-100 lg:aspect-auto lg:min-h-[320px]">
                    <ContentImage
                      src={leadImage}
                      alt={lead.title || "Article cover"}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 1024px) 100vw, 55vw"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  </Link>
                  <div className="flex flex-col justify-center p-8 sm:p-10">
                    <div className="flex flex-wrap items-center gap-3 text-xs">
                      {leadCategory ? (
                        <span className="rounded-md bg-teal-50 px-3 py-1 font-semibold text-teal-700">{leadCategory}</span>
                      ) : null}
                      <span className="inline-flex items-center gap-1.5 text-slate-500">
                        <Clock className="h-3.5 w-3.5" aria-hidden />
                        Featured
                      </span>
                    </div>
                    <h2 id="lead-heading" className="mt-5 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                      <Link href={leadHref} className="hover:text-teal-600 transition-colors">
                        {lead.title}
                      </Link>
                    </h2>
                    <p className="mt-4 text-sm leading-7 text-slate-500">
                      {excerpt(lead.summary || leadContent?.excerpt || leadContent?.description || leadContent?.body, 240)}
                    </p>
                    <Link
                      href={leadHref}
                      className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-teal-600 hover:text-teal-700 transition-colors"
                    >
                      Read full analysis
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
                    </Link>
                  </div>
                </div>
              </section>
            ) : null}

            <section id="article-grid" aria-labelledby="grid-heading">
              <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <h2 id="grid-heading" className="flex items-center gap-2.5 text-xl font-bold text-slate-900">
                    <BookOpen className="h-5 w-5 text-teal-600" aria-hidden />
                    {normalizedCategory === "all" ? "Latest Publications" : `More in ${categoryLabel(normalizedCategory)}`}
                  </h2>
                  <p className="mt-1.5 text-sm text-slate-500">Curated analysis and reports from our economics desk</p>
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

          <aside className="space-y-6 lg:sticky lg:top-24">
            <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <Filter className="h-4 w-4 text-teal-600" aria-hidden />
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Filter by Category</p>
              </div>
              <p className="mb-5 text-sm text-slate-500">Refine your reading list</p>
              <form className="grid gap-3" action={route} method="get">
                <label className="text-xs font-medium text-slate-700 sr-only" htmlFor="articles-cat">
                  Category
                </label>
                <select
                  id="articles-cat"
                  name="category"
                  defaultValue={normalizedCategory === "all" ? "all" : normalizedCategory}
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/15"
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
                  className="h-12 rounded-xl bg-teal-600 text-sm font-semibold text-white transition-all hover:bg-teal-700 hover:shadow-md hover:shadow-teal-500/20"
                >
                  Apply Filter
                </button>
              </form>
            </div>

            <div className="rounded-2xl border border-slate-200/60 bg-gradient-to-br from-teal-50 to-emerald-50 p-6">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-4 w-4 text-teal-600" aria-hidden />
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-700">Pro Tip</p>
              </div>
              <p className="text-sm leading-6 text-teal-800">
                Use the search bar at the top for quick lookups. Combine with category filters to drill down into specific economic sectors.
              </p>
            </div>
          </aside>
        </div>

        {intro ? (
          <section className="rounded-2xl border border-slate-200/60 bg-white p-8 shadow-sm sm:p-10">
            <h2 className="text-2xl font-bold text-slate-900">{intro.title}</h2>
            {intro.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 48)} className="mt-4 text-base leading-7 text-slate-600">
                {paragraph}
              </p>
            ))}
            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 border-t border-slate-100 pt-8 text-sm">
              {intro.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="inline-flex items-center gap-1 font-semibold text-teal-600 underline-offset-4 transition-colors hover:text-teal-700 hover:underline"
                >
                  {link.label}
                  <ArrowRight className="h-3.5 w-3.5" />
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
