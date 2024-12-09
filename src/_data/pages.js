import directus from './directus.js';
import { readItems } from '@directus/sdk';
import { richText } from './components/rich-text.js';
import { relatedContent } from './components/related-content.js';

export default async () => {
    try {
      return await directus.request(
        readItems('pages', {
          fields: [
            '*',
            {
              page_components: [
                '*',
                {
                  item: {
                    ...relatedContent,
                    ...richText,
                  }
                }
              ]
            }
          ]
        })
      );
    } catch(error) {
      console.error(error);
      return null;
    }
}