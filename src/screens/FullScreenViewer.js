import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Modal,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Text,
} from "react-native";
import { FlashList } from "@shopify/flash-list";
import FullScreenItem from "./FullScreenItem";

const { height, width } = Dimensions.get("window");

const FullScreenViewer = ({ data, initialIndex, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const flashListRef = useRef(null);

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 60,
  };

  // 🔁 Trigger initial viewable item manually
  useEffect(() => {
    setTimeout(() => {
      if (flashListRef.current && data?.length > 0) {
        flashListRef.current.scrollToIndex({ index: initialIndex, animated: false });
      }
    }, 50);
  }, [initialIndex]);

  return (
    <Modal visible animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        {/* ✅ Back button */}
        <TouchableOpacity style={styles.backButton} onPress={onClose}>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <FlashList
          data={data}
          ref={flashListRef}
          horizontal={false}
          pagingEnabled={false}
          initialScrollIndex={initialIndex}
          windowSize={3}
          maxToRenderPerBatch={2}
          initialNumToRender={3}
          removeClippedSubviews
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <FullScreenItem
              item={item}
              isVisible={index === currentIndex}
              fullScreen
            />
          )}
          viewabilityConfig={viewabilityConfig}
          onViewableItemsChanged={onViewableItemsChanged}
          getItemLayout={(_, index) => ({
            length: height,
            offset: height * index,
            index,
          })}
          extraData={currentIndex}
          snapToInterval={height}
          estimatedItemSize={height}
          snapToAlignment="start"
          decelerationRate="fast"
          bounces={false}
          onMomentumScrollEnd={() => {
            flashListRef.current?.recordInteraction();
          }}
        />
      </View>
    </Modal>
  );
};

export default FullScreenViewer;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "#000",
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 16,
    zIndex: 100,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 10,
    borderRadius: 20,
  },
  backText: {
    color: "#fff",
    fontSize: 20,
  },
});
