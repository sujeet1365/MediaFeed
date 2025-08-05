import React, { useRef, useMemo } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Video from "react-native-video";
import FastImage from "react-native-fast-image";
import { getVideoLink, getThumbnailLink } from "../../utils/mediaUtils";

const { height, width } = Dimensions.get("window");

const FullScreenItem = ({ item, isVisible }) => {
  const videoRef = useRef(null);

  const isVideo = item.type === "Video";
  const videoLink = useMemo(() => getVideoLink(item.video_files), [item]);
  const thumbnailLink = useMemo(() => getThumbnailLink(item), [item]);

  return (
    <View style={styles.fullScreenContainer}>
      {isVideo && videoLink && isVisible ? (
        <Video
          ref={videoRef}
          source={{ uri: videoLink }}
          style={styles.video}
          resizeMode="contain"
          paused={!isVisible}
          repeat
          controls={false}
          poster={thumbnailLink}
          posterResizeMode="contain"
        />
      ) : (
        <FastImage
          style={styles.image}
          source={{ uri: thumbnailLink }}
          resizeMode={FastImage.resizeMode.cover}
        />
      )}
    </View>
  );
};

const areEqual = (prev, next) =>
  prev.isVisible === next.isVisible && prev.item?.id === next.item?.id;

export default React.memo(FullScreenItem, areEqual);

const styles = StyleSheet.create({
  fullScreenContainer: {
    height,
    width,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  video: {
    ...StyleSheet.absoluteFillObject,
  },
  image: {
    height: "100%",
    width: "100%",
  },
});
