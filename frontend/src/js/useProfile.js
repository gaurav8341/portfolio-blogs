import { useEffect, useState } from 'react';
import axios from 'axios';
import { fetchUrls } from './utils';

/**
 * Loads profile.json — the hero copy, the "tools I use" list and the résumé
 * timeline. All of it lives in the gaurav8341/gaurav8341 repo alongside
 * skills.json and featuredProjects.json, so editing any of it is a commit
 * there rather than a redeploy of this site.
 *
 * The response is cached in module scope: Home and ResumePage both want it,
 * and there is no reason to fetch it twice per page load.
 */
let cache = null;
let inflight = null;

const loadProfile = () => {
  if (cache) return Promise.resolve(cache);
  if (inflight) return inflight;

  inflight = (async () => {
    const urls = await fetchUrls();
    const response = await axios.get(urls.profilePath);
    cache = response.data;
    return cache;
  })();

  // A failed load must not be cached as "in flight" forever.
  inflight.catch(() => {
    inflight = null;
  });

  return inflight;
};

const useProfile = () => {
  const [profile, setProfile] = useState(cache);
  const [loading, setLoading] = useState(!cache);

  useEffect(() => {
    if (cache) return;

    let active = true;

    loadProfile()
      .then((data) => {
        if (active) setProfile(data);
      })
      .catch((error) => {
        console.error('Error loading profile:', error);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return { profile, loading };
};

export default useProfile;
