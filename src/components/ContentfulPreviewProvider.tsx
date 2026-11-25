"use client";

import { ContentfulLivePreviewProvider } from "@contentful/live-preview/react";

export default function ContentfulPreviewProvider({
  isDraftMode,
  children,
}: {
  isDraftMode: boolean;
  children: React.ReactNode;
}) {
  if (!isDraftMode) {
    return <>{children}</>;
  }

  return (
    <ContentfulLivePreviewProvider
      locale="en-US"
      enableInspectorMode={isDraftMode}
      enableLiveUpdates={isDraftMode}
    >
      {children}
    </ContentfulLivePreviewProvider>
  );
}
