import { createDirectus, rest } from '@directus/sdk';

const directus = createDirectus('https://tristanhampton.hamserver.org').with(rest());

export default directus;