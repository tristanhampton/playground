import directus from './directus.js';
import { readItems } from '@directus/sdk';

export default async () => {
    return await directus.request(readItems('bookmarks'))
}