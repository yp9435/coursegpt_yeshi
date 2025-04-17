interface YoutubeEmbedProps {
    videoId: string
  }
  
  /**
   * A React component for embedding a YouTube video using an iframe.
   *
   * @param {YoutubeEmbedProps} props - The props for the YoutubeEmbed component.
   * @param {string} props.videoId - The unique identifier of the YouTube video to embed.
   *
   * @returns {JSX.Element} A responsive YouTube video embed wrapped in a styled container.
   *
   * @example
   * ```tsx
   * <YoutubeEmbed videoId="dQw4w9WgXcQ" />
   * ```
   */
  
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
  