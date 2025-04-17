/**
 * Fetches a list of YouTube videos based on the provided search query.
 *
 * @param query - The search term to query YouTube videos for.
 * @returns A promise that resolves to an array of YouTube video items.
 *
 * @remarks
 * This function uses the YouTube Data API v3 to perform the search. 
 * Ensure that the `YOUTUBE_API_KEY` environment variable is set with a valid API key.
 *
 * @throws Will throw an error if the fetch request fails or if the response cannot be parsed as JSON.
 */

export async function fetchYoutubeVideos(query: string) {
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/search?key=${process.env.YOUTUBE_API_KEY}&part=snippet&type=video&q=${encodeURIComponent(query)}&maxResults=5`
    );
  
    const data = await res.json();
    return data.items;
  }
  