import React, { useState, useCallback } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { FlashList } from "@shopify/flash-list";
import Item from "./Item";
import Loader from "../common/Loader";
import FullScreenViewer from "./FullScreenViewer";
import { useMediaList } from "../../hooks/useMediaList";

const MediaList = () => {
  const { mediaList, loading, hasMore, error, loadMore, retry } = useMediaList();
  const [visibleItems, setVisibleItems] = useState(new Set());
  const [selectedIndex, setSelectedIndex] = useState(null);

  // Callback to track visible items for video pause/resume
  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    setVisibleItems(new Set(viewableItems.map(vi => vi.item.id)));
  }, []);

  const viewabilityConfig = { itemVisiblePercentThreshold: 60 };

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "red", marginBottom: 8 }}>{error}</Text>
        <TouchableOpacity onPress={retry} style={styles.retryBtn}>
          <Text style={{ color: "#fff" }}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlashList
        data={mediaList}
        renderItem={({ item, index }) => (
          <TouchableOpacity activeOpacity={0.85} onPress={() => setSelectedIndex(index)}>
            <Item item={item} isVisible={visibleItems.has(item.id)} />
          </TouchableOpacity>
        )}
        keyExtractor={item => item.id.toString()}
        estimatedItemSize={300}
        contentContainerStyle={styles.listContent}
        viewabilityConfig={viewabilityConfig}
        onViewableItemsChanged={onViewableItemsChanged}
        extraData={visibleItems}
        onEndReached={hasMore ? loadMore : undefined}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading ? <Loader /> : null}
      />
      {selectedIndex !== null && (
        <FullScreenViewer
          data={mediaList}
          initialIndex={selectedIndex}
          onClose={() => setSelectedIndex(null)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f0f0' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  retryBtn: { backgroundColor: "#0099cc", padding: 12, borderRadius: 6 },
  listContent: { paddingVertical: 16 },
});

export default MediaList;
