import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { api } from '../lib/api';

type Community = {
  id: string;
  name: string;
  address: string;
  city: string;
  tier: string;
};

type CommunityState = {
  community: Community | null;
  communities: Community[];
  loading: boolean;
  refresh: () => Promise<void>;
  select: (id: string) => void;
};

let _communities: Community[] = [];
let _selected: Community | null = null;

export function useCommunity(): CommunityState {
  const [communities, setCommunities] = useState<Community[]>(_communities);
  const [community, setCommunity] = useState<Community | null>(_selected);
  const [loading, setLoading] = useState(!_selected);

  const refresh = useCallback(async () => {
    try {
      const res = await api<{ communities: Community[] }>('/communities');
      _communities = res.communities;
      setCommunities(res.communities);
      if (!_selected && res.communities.length > 0) {
        _selected = res.communities[0];
        setCommunity(res.communities[0]);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  const select = useCallback((id: string) => {
    const found = _communities.find(c => c.id === id);
    if (found) {
      _selected = found;
      setCommunity(found);
    }
  }, []);

  useEffect(() => {
    if (!_selected) refresh();
  }, [refresh]);

  return { community, communities, loading, refresh, select };
}
