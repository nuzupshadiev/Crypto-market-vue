import { ref, onUnmounted, watch, type Ref, type ComputedRef } from "vue";

type QueryT<T> = {
  data: Ref<T | null>;
  status: Ref<boolean>;
  loading: Ref<boolean>;
  lastUpdated: Ref<Date | null>;
  setData: (value: T | ((prev: T | null) => T)) => void;
  refetch: () => void;
};

type UseQueryOptions = {
  refetchInterval?: number;
  enabled?: boolean;
  keepPreviousData?: boolean;
};

type QueryInput<T> = Promise<T> | (() => Promise<T>) | ComputedRef<Promise<T>>;

export function useQuery<T>(
  query: QueryInput<T>,
  options?: UseQueryOptions
): QueryT<T> {
  const {
    refetchInterval,
    enabled = true,
    keepPreviousData = true,
  } = options || {};

  const data = ref<T | null>(null) as Ref<T | null>;
  const status = ref(false);
  const loading = ref(false);
  const lastUpdated = ref<Date | null>(null);
  const refetchTrigger = ref(0);
  const isFirstRun = ref(true);
  const isMounted = ref(true);

  // Create a stable getter that resolves to a fresh Promise each time
  const getPromise = (): Promise<T> => {
    if (typeof query === "function") {
      return (query as () => Promise<T>)();
    }
    // Handle computed refs
    if (query && typeof query === "object" && "value" in query) {
      const queryValue = (query as any).value;
      if (typeof queryValue === "function") {
        return queryValue();
      }
      return queryValue as Promise<T>;
    }
    return query as Promise<T>;
  };

  const setData = (value: T | ((prev: T | null) => T)) => {
    if (typeof value === "function") {
      data.value = (value as (prev: T | null) => T)(data.value);
    } else {
      data.value = value;
    }
  };

  const refetch = () => {
    refetchTrigger.value += 1;
  };

  const executeQuery = async () => {
    if (!enabled) {
      return;
    }

    if (isFirstRun.value || !keepPreviousData) {
      data.value = null;
      status.value = false;
    }

    loading.value = true;

    try {
      const result = await getPromise();
      if (isMounted.value) {
        data.value = result;
        lastUpdated.value = new Date();
      }
    } catch (err) {
      console.error("Query error:", err);
    } finally {
      if (isMounted.value) {
        loading.value = false;
        status.value = true;
        isFirstRun.value = false;
      }
    }
  };

  // Watch for changes in enabled, query, and refetchTrigger
  watch(
    [() => enabled, refetchTrigger],
    () => {
      executeQuery();
    },
    { immediate: true }
  );

  // Polling effect
  let intervalId: number | null = null;

  watch(
    [() => enabled, () => refetchInterval],
    ([newEnabled, newInterval]) => {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }

      if (newEnabled && newInterval && newInterval > 0) {
        intervalId = setInterval(() => {
          refetch();
        }, newInterval);
      }
    },
    { immediate: true }
  );

  // Cleanup on unmount
  onUnmounted(() => {
    isMounted.value = false;
    if (intervalId) {
      clearInterval(intervalId);
    }
  });

  return {
    data,
    status,
    loading,
    lastUpdated,
    setData,
    refetch,
  };
}
