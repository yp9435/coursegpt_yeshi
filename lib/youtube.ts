export async function fetchYoutubeVideos(query: string) {
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/search?key=${process.env.YOUTUBE_API_KEY}&part=snippet&type=video&q=${encodeURIComponent(query)}&maxResults=5`
    );
  
    const data = await res.json();
    return data.items;
  }
  