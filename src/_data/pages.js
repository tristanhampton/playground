import directus from './directus.js';
import { readItems } from '@directus/sdk';

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
                    related_content: ['*',
                      {
                        // Need to figure out how to get the page data from here
                        pages: ['*']
                      }
                    ],
                    block_rich_text: ['*'],
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