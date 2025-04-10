interface YoutubeEmbedProps {
    videoId: string
  }
  
  export function YoutubeEmbed({ videoId }: YoutubeEmbedProps) {
    return (
      <div className="relative aspect-video w-full overflow-hidden rounded-md">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
        ></iframe>
      </div>
    )
  }
  