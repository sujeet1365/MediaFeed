import React, { useRef, useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import FastImage from 'react-native-fast-image';
import Video from 'react-native-video';
import { getVideoLink, getThumbnailLink } from '../../utils/mediaUtils';

const { width } = Dimensions.get('window');

const Item = ({ item, isVisible }) => {
  const isPhoto = item.type === 'Photo';
  const isVideo = item.type === 'Video';
  const videoRef = useRef(null);

  const videoLink = useMemo(() => getVideoLink(item.video_files), [item]);
  const thumbnailLink = useMemo(() => getThumbnailLink(item), [item]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{item.alt || `User: ${item?.user?.name}`}</Text>
      {isPhoto && item.src?.large2x && (
        <FastImage
          style={styles.media}
          source={{ uri: item.src.large2x, priority: FastImage.priority.normal }}
          resizeMode={FastImage.resizeMode.contain}
        />
      )}

      {isVideo && videoLink && (
        <View style={styles.media}>
          {isVisible ? (
            <Video
              ref={videoRef}
              source={{ uri: videoLink }}
              style={StyleSheet.absoluteFill}
              resizeMode="contain"
              paused={false}
              repeat
              controls={false}
              poster={thumbnailLink}
              posterResizeMode="cover"
            />
          ) : (
            <FastImage
              style={StyleSheet.absoluteFill}
              source={{ uri: thumbnailLink }}
              resizeMode={FastImage.resizeMode.contain}
            />
          )}
        </View>
      )}
    </View>
  );
};

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
  }
});
