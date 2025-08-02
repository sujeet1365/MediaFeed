import React, { useRef, useState, useEffect, useCallback } from "react";
import { View, StyleSheet, Dimensions, ActivityIndicator } from "react-native";
import Video from "react-native-video";
import FastImage from "react-native-fast-image";

const { height, width } = Dimensions.get("window");

const FullScreenItem = ({ item, isVisible, fullScreen = false }) => {
  const [loading, setLoading] = useState(true);
  const videoRef = useRef(null);

  const videoFiles = Array.isArray(item.video_files)
    ? item.video_files.flat()
    : [];

  const videoLink =
  videoFiles.find(v => v.quality === "sd")?.link ||
  videoFiles.find(v => v.quality === "hd")?.link ||
  videoFiles?.[0]?.link;

  const thumbnailLink =
    item.image || item.video_pictures?.[0]?.picture || item.src?.medium;

  const onLoadStart = useCallback(() => setLoading(true), []);
  const onLoad = useCallback(() => setLoading(false), []);
  const onError = useCallback((e) => {
    console.error(`Video error ID ${item.id}:`, e?.nativeEvent?.error);
    setLoading(false);
  }, [item.id]);

  // Cleanup effect
  useEffect(() => {
    let isMounted = true;
    return () => {
      isMounted = false;
    };
  }, []);

  const isVideo = item.type === "Video";

  return (
    <View style={styles.fullScreenContainer}>
      {isVideo && videoLink ? (
        <>
          {(loading || !isVisible) && (
            <>
              <FastImage
                source={{ uri: thumbnailLink }}
                style={styles.thumbnail}
                resizeMode={FastImage.resizeMode.cover}
              />
              {loading && (
                <ActivityIndicator
                  style={styles.loader}
                  size="large"
                  color="#fff"
                />
              )}
            </>
          )}

          {isVisible && (
            <Video
              ref={videoRef}
              source={{ uri: videoLink }}
              resizeMode="contain"
              style={styles.video}
              paused={!isVisible || loading}
              repeat
              muted
              controls={false}
              onLoadStart={onLoadStart}
              onLoad={onLoad}
              onError={onError}
              ignoreSilentSwitch="obey"
              estimatedItemSize={height}
            />
          )}
        </>
      ) : (
        <FastImage
          source={{ uri: thumbnailLink }}
          style={styles.image}
          resizeMode={FastImage.resizeMode.contain}
        />
      )}
    </View>
  );
};

// Avoid unnecessary re-renders
const areEqual = (prevProps, nextProps) =>
  prevProps.isVisible === nextProps.isVisible &&
  prevProps.item?.id === nextProps.item?.id &&
  prevProps.fullScreen === nextProps.fullScreen;

export default React.memo(FullScreenItem, areEqual);

const styles = StyleSheet.create({
  fullScreenContainer: {
    height: height,
    width: width,
    backgroundColor: "#000",
  },
  video: {
    ...StyleSheet.absoluteFillObject,
  },
  thumbnail: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#000",
  },
  loader: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -12 }, { translateY: -12 }],
    zIndex: 10,
  },
  image: {
    height: "100%",
    width: "100%",
  },
});
