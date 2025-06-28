import React from 'react';

interface YouTubeEmbedProps {
  youtubeUrl: string;
  title: string;
}

export function YouTubeEmbed({ youtubeUrl, title }: YouTubeEmbedProps) {
  // Extract video ID from YouTube URL
  const getVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = getVideoId(youtubeUrl);

  if (!videoId) {
    return (
      <div className="placeholder-bg w-full h-64 flex items-center justify-center card-hover">
        <div className="text-center">
          <div className="w-16 h-12 bg-red-600 rounded mx-auto mb-2 flex items-center justify-center smooth-bounce">
            <div className="w-0 h-0 border-l-8 border-l-[#b5b3a7] border-t-4 border-t-transparent border-b-4 border-b-transparent ml-1"></div>
          </div>
          <span className="text-[#1c1c1c] text-lg font-normal">Invalid YouTube URL</span>
        </div>
      </div>
    );
  }

  const embedUrl = `https://www.youtube.com/embed/${videoId}`;

  return (
    <div className="w-full h-64 card-hover">
      <iframe
        src={embedUrl}
        title={title}
        className="w-full h-full rounded-lg"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}