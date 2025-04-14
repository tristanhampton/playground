import { createDirectus, rest } from '@directus/sdk';

let directus;

try {
  directus = createDirectus('https://tristanhampton.hamserver.org').with(rest());
} catch (error) {
  console.error('Error creating Directus instance:', error);
}

export default directus;