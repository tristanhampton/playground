const os = require('os');
const dumpFilter = require("@jamshop/eleventy-filter-dump");
const eleventyPluginSharpImages = require("@codestitchofficial/eleventy-plugin-sharp-images");
const { title } = require('process');

// https://github.com/markdown-it/markdown-it
const md = require('markdown-it')({
	html: true,
	linkify: true,
	typographer: true
});

module.exports = function (config) {
	// Override 11tydata filename to static string: https://www.11ty.dev/docs/config/#change-base-file-name-for-data-files
	config.setDataFileBaseName("_index");

	// 11ty uses gitignore to ignore watching files. Disable this.
	config.setUseGitIgnore(false);

	// We're setting 11ty to build when scss/js is updated, but we want a delay so that the assets have time to build
	config.setWatchThrottleWaitTime(120);

	/* Plugins
	 * ----------------------------------------------- */
	config.addFilter("dump", dumpFilter);
	config.addFilter("markdown", function (content) {
		return md.render(content);
	});
	// https://www.npmjs.com/package/@codestitchofficial/eleventy-plugin-sharp-images
	config.addPlugin(eleventyPluginSharpImages, {
		urlPath: "/img/processed",
		outputDir: "_site/img/processed",
	});


	/* General Site Setup
	 * ----------------------------------------------- */
	//--- Watches
	config.addWatchTarget("src/scss/**/*.scss");
	config.addWatchTarget("src/js/**/*.js");

	//--- Adds CSS/JS to _site
	config.addPassthroughCopy({ "_dist/main.css": "css/main.css" });
	config.addPassthroughCopy({ "_dist/main.js": "js/main.js" });
	config.addPassthroughCopy({ "_dist/img": "img/processed" });
	config.addPassthroughCopy({ "src/js/plugins/*.js": "js/plugins" });

	//--- Adds Favicons to _site
	config.addPassthroughCopy({ "src/favicons": "favicons" });

	//--- Adds images to _site
	config.addPassthroughCopy({ "src/img": "img" });

	//--- Adds fonts to _site
	config.addPassthroughCopy({ "src/fonts": "fonts" });

	/* Content Assets
	 * ----------------------------------------------- */
	//--- Creative Coding
	config.addPassthroughCopy({ "src/_content/generative/*/*.js": 'js/generative' });
	config.addPassthroughCopy({ "src/_content/generative/*/*.png": 'img/generative' });
	config.addPassthroughCopy({ "src/_content/generative/*/*.json": 'js/generative' });
	config.addPassthroughCopy({ "src/_content/generative/*/*.mp3": 'mp3/generative' });

	//--- Projects
	config.addPassthroughCopy({ "src/_content/projects/*/*.png": 'projects/img' });

	//--- Tools
	config.addPassthroughCopy({ "src/_content/tools/*/*.js": 'tools/js' });

	/* Shortcodes
	 * ----------------------------------------------- */
	config.addShortcode("youtube", (videoURL, title) => {
		const url = new URL(videoURL);
		const id = url.searchParams.get("v");
		return `
			<iframe class="yt-shortcode" src="https://www.youtube-nocookie.com/embed/${id}" title="YouTube video player${title ? ` for ${title}` : ""}" frameborder="0" allowfullscreen></iframe>`;
	});

	config.addShortcode('galleryItem', (img, caption, galleryID) => {
		return `<a class="gallery__item" href="${img}" data-fancybox="${galleryID}" data-caption="${caption}"><img src="${img}"></a> `;
	})

	//--- Determine if local or live
	config.addGlobalData('local', function () {
		const hostname = os.hostname();

		if (hostname.includes('local')) {
			return true;
		} else {
			return false;
		}
	});

	return {
		pathPrefix: "/",
		dir: {
			input: "./src/_content/",
			output: "_site",
			includes: "../../src/_includes",
			layouts: "../../src/_layouts",
			data: "../../src/_data"
		}
	};
}