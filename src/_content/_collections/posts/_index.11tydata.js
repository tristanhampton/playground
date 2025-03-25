export default {
    layout: 'blog',
    tags: 'post',
    backLink: '/writing/long-form',
    permalink: data => {
        return `/notes/long-form/${data.page.fileSlug}/`;
    },
}