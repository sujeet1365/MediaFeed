import React, { useRef, useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import FastImage from 'react-native-fast-image';
import Video from 'react-native-video';

const { width } = Dimensions.get('window');

const Item = ({ item, isVisible }) => {
  const isPhoto = item.type === 'Photo';
  const isVideo = item.type === 'Video';

  const videoRef = useRef(null);
  const [isVideoLoading, setIsVideoLoading] = useState(true);

  // Flatten possible nested video_files
  const videoFiles = Array.isArray(item.video_files?.[0])
    ? item.video_files.flat()
    : item.video_files || [];

  const videoLink =
    videoFiles.find(v => v.quality === "sd")?.link ||
    videoFiles.find(v => v.quality === "hd")?.link ||
    videoFiles?.[0]?.link;
  const thumbnailLink = item.image || item.video_pictures?.[0]?.picture;

  const onLoadStart = useCallback(() => setIsVideoLoading(true), []);
  const onLoad = useCallback(() => setIsVideoLoading(false), []);
  const onError = useCallback((e) => {
    console.error(`Video error ID ${item.id}:`, e?.nativeEvent?.error);
    setIsVideoLoading(false);
  }, [item.id]);

  // Avoid state update if unmounted
  useEffect(() => {
    let isMounted = true;
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{item.alt || `User: ${item?.user?.name}`}</Text>

      {/* Photo */}
      {isPhoto && item.src?.large2x && (
        <FastImage
          source={{ uri: item.src.large2x }}
          style={styles.media}
          resizeMode={FastImage.resizeMode.cover}
        />
      )}

      {/* Video */}
      {isVideo && videoLink && (
        <View style={styles.media}>
          {(!isVisible || isVideoLoading) && (
            <>
              <FastImage
                source={{ uri: thumbnailLink }}
                style={StyleSheet.absoluteFill}
                resizeMode={FastImage.resizeMode.cover}
              />
              <ActivityIndicator style={styles.loader} size="large" color="#fff" />
            </>
          )}

          {isVisible && (
            <Video
              ref={videoRef}
              source={{ uri: videoLink }}
              style={StyleSheet.absoluteFill}
              resizeMode="cover"
              paused={!isVisible || isVideoLoading}
              repeat
              muted
              controls={false}
              ignoreSilentSwitch="obey"
              onLoadStart={onLoadStart}
              onLoad={onLoad}
              onError={onError}
            />
          )}
        </View>
      )}
    </View>
  );
};

// Custom comparison to avoid unnecessary re-renders
const areEqual = (prevProps, nextProps) =>
  prevProps.isVisible === nextProps.isVisible &&
  prevProps.item?.id === nextProps.item?.id;

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
    position: 'absolute',
    zIndex: 10,
  },
});
