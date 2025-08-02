import FastImage from 'react-native-fast-image';

export const preloadImages = (media) => {
  const uris = media.map(item => {
    // for photos: src.large2x, for videos: poster or thumbnail
    if (item.type === 'Photo') return {uri: item.src.large2x};
    if (item.type === 'Video') return {uri: item.image || item.video_pictures?.[0]?.picture};
    return null;
  }).filter(Boolean);
  if (uris.length > 0) FastImage.preload(uris);
};
