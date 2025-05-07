"use client";

import GenreSearchClient from "../components/GenreSearch";
import ScrollAnimationWrapper from "../components/ScrollAnimationWrapper";

export default function GenrePage() {
  return (
    <div className="min-h-screen pt-24 pb-10 bg-gray-900">
      <ScrollAnimationWrapper>
        <section>
          <GenreSearchClient />
        </section>
      </ScrollAnimationWrapper>
    </div>
  );
}
