export default {
    layout: 'note',
    permalink: data => {

        // Use slug value if provided
        if (data.slug && data.tags) {
            return `/notes/${data.tags.includes('short') ? 'short-form' : 'long-form'}/${data.slug}.html`;
        }

        // Otherwise build with title
        if (data.title && data.tags && data.tags.includes('short')) {
            return `/notes/${data.tags.includes('short') ? 'short-form' : 'long-form'}/${data.title.toLowerCase().replace(/\s/g, '-').replace(/[^\w-]/g, '')}.html`;
        }

        return false;
    },
}