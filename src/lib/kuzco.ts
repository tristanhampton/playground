import { getCollection } from 'astro:content';

/**
 * Total distance walked, summed from the Strava activities tagged
 * `kuzco-tracker`. Replaces the old src/_data/kuzcoTracker.js, which read the
 * markdown off disk with gray-matter; the content collection already has it.
 */
export async function getKuzcoDistance(): Promise<string> {
  const activities = await getCollection('strava');

  const total = activities
    .filter((activity) => {
      const tags = activity.data.tags;
      const list = typeof tags === 'string' ? [tags] : (tags ?? []);
      return list.includes('kuzco-tracker');
    })
    .reduce((sum, activity) => {
      const distance = parseFloat((activity.data.distance ?? '').replace('km', ''));
      return sum + (Number.isNaN(distance) ? 0 : distance);
    }, 0);

  return `${total.toFixed(1)} km`;
}
