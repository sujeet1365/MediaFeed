import { FlashList } from "@shopify/flash-list";
import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import { View, StyleSheet, ActivityIndicator, TouchableOpacity } from "react-native";
import Item from "../Item";
import FullScreenViewer from "./FullScreenViewer";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const API_KEY = 'M9Moel9GsArJamlr5r9jreQwZm4Z8EZRyIRAN29lEs1UszjOfZrklVAy';
const COLLECTION_ID = 'vog4mjt';
const PER_PAGE = 10;

const MediaList = () => {
    const [page, setPage] = useState(1);
    const [mediaList, setMediaList] = useState([]);
    const [visibleItems, setVisibleItems] = useState(new Set());
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(null);

    const getMediaList = async (nextPage) => {
        try {
            const response = await axios.get(
                `https://api.pexels.com/v1/collections/${COLLECTION_ID}?page=${nextPage}&per_page=${PER_PAGE}`,
                {
                    headers: {
                        Authorization: API_KEY,
                    },
                }
            );
            const newMediaList = response.data.media || [];
            if (newMediaList.length < PER_PAGE) {
                setHasMore(false);
            }
            setMediaList(prevList => [...prevList, ...newMediaList]);
            // console.log("List data:", newMediaList);
            setIsLoading(false);
        } catch (error) {
            console.error("Failed to fetch media list:", error);
        }
    };

    useEffect(() => {
        getMediaList(1);
    }, []);

    const loadMore = async () => {
        console.log(`Loading more items, current page: ${page}`);
        if (isLoading || !hasMore) return;
        let nextPage = page + 1;
        setPage(nextPage);
        setIsLoading(true);
        getMediaList(nextPage)
    }


    // ✅ Directly pass this to FlashList
    const onViewableItemsChanged = useCallback(({ viewableItems }) => {
        const visibleSet = new Set(viewableItems.map((vi) => vi.item.id));
        setVisibleItems(visibleSet);
    }, []);

    const viewabilityConfig = {
        itemVisiblePercentThreshold: 60,
    };

    return (
         <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={styles.container}>
            <FlashList
                data={mediaList}
                renderItem={({ item, index }) => (
                    <TouchableOpacity onPress={() => setSelectedIndex(index)}>
                        <Item
                            item={item}
                            isVisible={visibleItems.has(item.id)}
                        />
                    </TouchableOpacity>
                )}
                keyExtractor={(item) => item.id.toString()}
                estimatedItemSize={300}
                contentContainerStyle={styles.listContent}
                viewabilityConfig={viewabilityConfig}
                onViewableItemsChanged={onViewableItemsChanged}
                extraData={visibleItems}
                onEndReached={loadMore}
                onEndReachedThreshold={0.5}
                ListFooterComponent={isLoading ? <ActivityIndicator size="large" color="#0000ff" /> : null}
            />
            {selectedIndex !== null && (
                <FullScreenViewer
                    data={mediaList}
                    initialIndex={selectedIndex}
                    onClose={() => setSelectedIndex(null)}
                />
            )}
        </View>
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
    },
    listContent: {
        paddingVertical: 16,
    },
});

export default MediaList;
