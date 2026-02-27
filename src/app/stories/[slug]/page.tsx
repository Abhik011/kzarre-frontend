"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import "./StoryPage.css";
import PageLayout from "@/app/components/PageLayout ";
export default function StoryPage() {

  interface StoryStyle {
    titleFont?: string;
    bodyFont?: string;
    titleSize?: string;
    bodySize?: string;
    titleColor?: string;
    bodyColor?: string;
    lineHeight?: string;
    paragraphSpacing?: string;
    sectionSpacing?: string;
    textAlign?: "left" | "center" | "justify";
    maxWidth?: string;
    backgroundColor?: string;
  }

  interface Story {
    title: string;
    subtitle?: string;
    content: string;
    coverImage: string;
    images?: string[];
    style?: StoryStyle; // ✅ ADD THIS
  }


  const { slug } = useParams();
  const [story, setStory] = useState<Story | null>(null);

  useEffect(() => {
    fetch(`/api/stories/${slug}`)
      .then((r) => r.json())
      .then((d) => setStory(d.story));
  }, [slug]);

  if (!story) return null;

  const style = story.style || {};
  const images = story.images ?? [];
  return (
    <PageLayout>
      <article className="story-page">
        <div className="story-hero">
          <img src={story.coverImage} />
        </div>

        <div className="story-container">
          <h1 className="story-title">{story.title}</h1>
          {story.subtitle && (
            <p className="story-subtitle">{story.subtitle}</p>
          )}

          <div
            className="story-content"
            dangerouslySetInnerHTML={{ __html: story.content }}
          />
        </div>
        {story.images && story.images.length > 0 && (
          <div className="story-gallery">
            {story.images.map((img: string, i: number) => (
              <img key={i} src={img} alt={`Story image ${i + 1}`} />
            ))}
          </div>
        )}
      </article>
    </PageLayout>
  );
}
