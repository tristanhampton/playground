# Playground
Use `npm run dev` for local, which will serve 11ty on localhost, and build out and listen for changes in `.scss` and `.js` files. Use `npm run build` for production builds. 

## Github Actions
in the `.github` directory, I'm using github actions to sync some of the content directories to my 2024 portfolio. This way, I can update most content here and have it sync across both sites. This requires a Personal Access Token that can be replaced in this repo's settings when it expires at `Settings > Secrets and Variables > Actions`.

## Echo
I have used a version of Robb Knight's "Echo" JS app to scrape content from various services to populate data in my /me page. This is handled in my [Echo repo](https://github.com/tristanhampton/echo) and is hosted on my home server.

## Webpack
Set to complile scss and JS files. Outputs to `./_dist` in the root. 11ty is configured to listen for changes to `.scss` and `.js` files, and has a 120ms delay so that it will get the latest changes from webpack when editing these files. 

### Content
Located in the `_content` directory. Site URL's follow the directory pattern with index.njk files. For example, `_content/blog/my-post/index.njk` would result in the slug `/blog/my-post/`.

### Data
Custom data can be added to the `_data` directory, along with some helpers for 11ty templating.

### Layouts
11ty layouts can be defined in `_layouts`.

### Includes
Components such as the head, header, and footer that will be reused can be defined here to be included in templates.