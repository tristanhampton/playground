import directus from './directus.js';
import { readSingleton } from '@directus/sdk';

export default async () => {
    return await directus.request(readSingleton('global'))
}