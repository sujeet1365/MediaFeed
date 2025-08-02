import { useState, useEffect, useRef, useCallback } from 'react';
import { fetchMediaCollection } from '../../api/mediaService';
import axios from 'axios';
import { preloadImages } from '../utils/preLoadMedia';

const PER_PAGE = 10;

export const useMediaList = () => {
  const [page, setPage] = useState(1);
  const [mediaList, setMediaList] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Prevent state update on unmount
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    loadMedia(1, true);
    return () => { mountedRef.current = false; };
    // eslint-disable-next-line
  }, []);

  const loadMedia = async (nextPage, isInitial = false) => {
    setLoading(true);
    setError(null);
    const source = axios.CancelToken.source();
    try {
      const newMedia = await fetchMediaCollection(nextPage, PER_PAGE, source.token);
      if (!mountedRef.current) return;
      setHasMore(newMedia.length === PER_PAGE);
      preloadImages(newMedia);
      setMediaList(prev =>
        isInitial ? newMedia : [...prev, ...newMedia]
      );
      setPage(nextPage);
    } catch (err) {
      if (!axios.isCancel(err)) setError(err.message);
    } finally {
      if (mountedRef.current) setLoading(false);
    }
    return () => source.cancel();
  };

  const loadMore = useCallback(() => {
    if (!loading && hasMore) loadMedia(page + 1);
  }, [loading, hasMore, page]);

  const retry = () => {
    loadMedia(page, true);
  };

  return {
    mediaList,
    loading,
    hasMore,
    error,
    loadMore,
    retry,
  };
};
