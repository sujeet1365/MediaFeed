// Extract best video link from video_files array
export function getVideoLink(videoFiles) {
  if (!Array.isArray(videoFiles)) return null;
  const flat = Array.isArray(videoFiles[0]) ? videoFiles.flat() : videoFiles;
  return (
    flat.find(v => v.quality === 'sd')?.link ||
    flat.find(v => v.quality === 'hd')?.link ||
    flat[0]?.link
  );
}

export function getThumbnailLink(item) {
  return item.image || item.video_pictures?.[0]?.picture || item.src?.large2x;
}
