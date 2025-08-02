import React, { useRef, useState, useCallback } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Video from "react-native-video";
import FastImage from "react-native-fast-image";
import Loader from "../common/Loader";
import { getVideoLink, getThumbnailLink } from "../../utils/mediaUtils";

const { height, width } = Dimensions.get("window");

const FullScreenItem = ({ item, isVisible }) => {
  const [loading, setLoading] = useState(true);
  const videoRef = useRef(null);

  const isVideo = item.type === "Video";
  const videoLink = getVideoLink(item.video_files);
  const thumbnailLink = getThumbnailLink(item);

  const onLoadStart = useCallback(() => setLoading(true), []);
  const onLoad = useCallback(() => setLoading(false), []);
  const onError = useCallback(() => setLoading(false), []);

  return (
    <View style={styles.fullScreenContainer}>
      {isVideo && videoLink ? (
        <>
          <Video
            ref={videoRef}
            source={{ uri: videoLink }}
            style={styles.video}
            resizeMode="contain"
            paused={!isVisible}
            onLoadStart={onLoadStart}
            onLoad={onLoad}
            onError={onError}
            repeat
            controls={false}
            poster={thumbnailLink}
            posterResizeMode="contain"
          />
          {loading && (
            <View style={styles.loader}>
              <Loader />
            </View>
          )}
        </>
      ) : (
        <FastImage
          style={styles.image}
          source={{ uri: thumbnailLink }}
          resizeMode={FastImage.resizeMode.contain}
        />
      )}
    </View>
  );
};

const areEqual = (prev, next) =>
  prev.isVisible === next.isVisible && prev.item?.id === next.item?.id;

export default React.memo(FullScreenItem, areEqual);

const styles = StyleSheet.create({
  fullScreenContainer: { height, width, backgroundColor: "#000" },
  video: { ...StyleSheet.absoluteFillObject },
  loader: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -12 }, { translateY: -12 }],
    zIndex: 10,
  },
  image: { height: "100%", width: "100%" },
});
