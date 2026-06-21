import { useState, useEffect, useCallback } from 'react';

export const useFetch = (fetchCallback, immediate = true) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchCallback(...args);
      setData(response);
      return response;
    } catch (err) {
      setError(err.message || 'An error occurred while fetching data');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchCallback]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return { data, loading, error, execute, setData };
};
