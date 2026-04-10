import { ArticlesLibraryPage } from "@/components/tasks/articles-library-page";
import { buildTaskMetadata } from "@/lib/seo";
import { taskPageMetadata } from "@/config/site.content";

export const revalidate = 3;

export const generateMetadata = () =>
  buildTaskMetadata("article", {
    path: "/articles",
    title: taskPageMetadata.article.title,
    description: taskPageMetadata.article.description,
  });

export default function ArticlesPage({ searchParams }: { searchParams?: { category?: string } }) {
  return <ArticlesLibraryPage category={searchParams?.category} />;
}
