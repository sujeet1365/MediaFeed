import React, { useRef, useState, useEffect } from "react";
import { View, Modal, Dimensions, StyleSheet, TouchableOpacity, Text } from "react-native";
import { FlashList } from "@shopify/flash-list";
import throttle from "lodash.throttle";
import FullScreenItem from "./FullScreenItem";

const { height } = Dimensions.get("window");

const FullScreenViewer = ({ data, initialIndex, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const flashListRef = useRef(null);

  const onViewableItemsChanged = useRef(
    throttle(({ viewableItems }) => {
      if (viewableItems?.length > 0) {
        setCurrentIndex(viewableItems[0].index);
      }
    }, 300)
  ).current;

  const viewabilityConfig = { itemVisiblePercentThreshold: 80 };

  useEffect(() => {
    setTimeout(() => {
      if (flashListRef.current && data?.length > 0) {
        flashListRef.current.scrollToIndex({ index: initialIndex, animated: false });
      }
    }, 50);
  }, [initialIndex, data.length]);

  return (
    <Modal visible transparent={false} animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <TouchableOpacity style={styles.backButton} onPress={onClose}>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <FlashList
          ref={flashListRef}
          data={data}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item, index }) => (
            <FullScreenItem item={item} isVisible={index === currentIndex} />
          )}
          horizontal={false}
          showsVerticalScrollIndicator={false}
          viewabilityConfig={viewabilityConfig}
          onViewableItemsChanged={onViewableItemsChanged}
          getItemLayout={(_, index) => ({ length: height, offset: height * index, index })}
          extraData={currentIndex}
          snapToInterval={height}
          estimatedItemSize={height}
          snapToAlignment="start"
          decelerationRate="fast"
          bounces={false}
          initialNumToRender={3}
          maxToRenderPerBatch={3}
          windowSize={5}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: { flex: 1, backgroundColor: "#000" },
  backButton: {
    position: "absolute",
    top: 40,
    left: 16,
    zIndex: 100,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 10,
    borderRadius: 20,
  },
  backText: { color: "#fff", fontSize: 20 },
});

export default FullScreenViewer;
