import { notFound } from "next/navigation";
import { getLesson } from "@/data/curriculum";
import LessonView from "@/components/lesson-view";

export default async function LessonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lesson = getLesson(slug);
  if (!lesson) notFound();
  return <LessonView lesson={lesson} />;
}