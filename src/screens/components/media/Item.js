import React, { useRef, useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import FastImage from 'react-native-fast-image';
import Video from 'react-native-video';
import Loader from '../common/Loader';
import { getVideoLink, getThumbnailLink } from '../../utils/mediaUtils';

const { width } = Dimensions.get('window');

const Item = ({ item, isVisible }) => {
  const isPhoto = item.type === 'Photo';
  const isVideo = item.type === 'Video';
  const videoRef = useRef(null);
  const [isVideoLoading, setIsVideoLoading] = useState(true);

  const videoLink = getVideoLink(item.video_files);
  const thumbnailLink = getThumbnailLink(item);

  const onLoadStart = useCallback(() => setIsVideoLoading(true), []);
  const onLoad = useCallback(() => setIsVideoLoading(false), []);
  const onError = useCallback(
    e => {
      setIsVideoLoading(false);
    },
    []
  );

  // Prevent memory leaks on unmount (for async state updates)
  useEffect(() => {
    let mounted = true;
    return () => { mounted = false; };
  }, []);

  // Main render
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{item.alt || `User: ${item?.user?.name}`}</Text>
      {isPhoto && item.src?.large2x && (
        <FastImage
          style={styles.media}
          source={{ uri: item.src.large2x, priority: FastImage.priority.normal }}
          resizeMode={FastImage.resizeMode.cover}
        />
      )}
      {isVideo && videoLink && (
        <View style={styles.media}>
          <Video
            ref={videoRef}
            source={{ uri: videoLink }}
            style={StyleSheet.absoluteFill}
            resizeMode="cover"
            paused={!isVisible}
            onLoadStart={onLoadStart}
            onLoad={onLoad}
            onError={onError}
            repeat
            controls={false}
            poster={thumbnailLink}
            posterResizeMode="cover"
          />
          {isVideoLoading && (
            <View style={styles.loader}>
              <Loader />
            </View>
          )}
        </View>
      )}
    </View>
  );
};

// Memoize to avoid unnecessary renders
const areEqual = (prev, next) =>
  prev.isVisible === next.isVisible && prev.item?.id === next.item?.id;

export default React.memo(Item, areEqual);

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#fff',
    marginHorizontal: 16,
  },
  title: {
    padding: 10,
    fontSize: 16,
    fontWeight: 'bold',
    backgroundColor: '#f8f8f8',
    color: '#333',
  },
  media: {
    width: width - 32,
    height: 220,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loader: {
    ...StyleSheet.absoluteFill,
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
});
