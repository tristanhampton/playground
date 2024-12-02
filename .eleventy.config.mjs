import os from 'os';
import dumpFilter from "@jamshop/eleventy-filter-dump";
import eleventyPluginSharpImages from "@codestitchofficial/eleventy-plugin-sharp-images";
import markdownit from 'markdown-it';

// https://github.com/markdown-it/markdown-it
const md = markdownit({
	html: true,
	linkify: true,
	typographer: true
});

export default function (eleventyConfig) {
	// Override 11tydata filename to static string: https://www.11ty.dev/docs/config/#change-base-file-name-for-data-files

	// This isn't working
	eleventyConfig.setDataFileBaseName("_index");

	// 11ty uses gitignore to ignore watching files. Disable this.
	eleventyConfig.setUseGitIgnore(false);

	// We're setting 11ty to build when scss/js is updated, but we want a delay so that the assets have time to build
	eleventyConfig.setWatchThrottleWaitTime(120);

	/* Plugins
	 * ----------------------------------------------- */
	eleventyConfig.addFilter("dump", dumpFilter);
	eleventyConfig.addFilter("markdown", function (content) {
		return md.render(content);
	});
	// https://www.npmjs.com/package/@codestitchofficial/eleventy-plugin-sharp-images
	eleventyConfig.addPlugin(eleventyPluginSharpImages, {
		urlPath: "/img/processed",
		outputDir: "_site/img/processed",
	});


	/* General Site Setup
	 * ----------------------------------------------- */
	//--- Watches
	eleventyConfig.addWatchTarget("src/scss/**/*.scss");
	eleventyConfig.addWatchTarget("src/js/**/*.js");

	//--- Adds CSS/JS to _site
	eleventyConfig.addPassthroughCopy({ "_dist/main.css": "css/main.css" });
	eleventyConfig.addPassthroughCopy({ "_dist/main.js": "js/main.js" });
	eleventyConfig.addPassthroughCopy({ "_dist/img": "img/processed" });
	eleventyConfig.addPassthroughCopy({ "src/js/plugins/*.js": "js/plugins" });

	//--- Adds Favicons to _site
	eleventyConfig.addPassthroughCopy({ "src/favicons": "favicons" });

	//--- Adds images to _site
	eleventyConfig.addPassthroughCopy({ "src/img": "img" });

	//--- Adds fonts to _site
	eleventyConfig.addPassthroughCopy({ "src/fonts": "fonts" });

	/* Content Assets
	 * ----------------------------------------------- */
	//--- Creative Coding
	eleventyConfig.addPassthroughCopy({ "src/_content/generative/*/*.js": 'js/generative' });
	eleventyConfig.addPassthroughCopy({ "src/_content/generative/*/*.png": 'img/generative' });
	eleventyConfig.addPassthroughCopy({ "src/_content/generative/*/*.json": 'js/generative' });
	eleventyConfig.addPassthroughCopy({ "src/_content/generative/*/*.mp3": 'mp3/generative' });

	//--- Projects
	eleventyConfig.addPassthroughCopy({ "src/_content/projects/*/*.png": 'projects/img' });

	//--- Tools
	eleventyConfig.addPassthroughCopy({ "src/_content/tools/*/*.js": 'tools/js' });

	// /* Shortcodes
	//  * ----------------------------------------------- */
	eleventyConfig.addShortcode("youtube", (videoURL, title) => {
		const url = new URL(videoURL);
		const id = url.searchParams.get("v");
		return `
			<iframe class="yt-shortcode" src="https://www.youtube-nocookie.com/embed/${id}" title="YouTube video player${title ? ` for ${title}` : ""}" frameborder="0" allowfullscreen></iframe>`;
	});

	eleventyConfig.addShortcode('galleryItem', (img, caption, galleryID) => {
		return `<a class="gallery__item" href="${img}" data-fancybox="${galleryID}" data-caption="${caption}"><img src="${img}"></a> `;
	})

	//--- Determine if local or live
	eleventyConfig.addGlobalData('local', function () {
		const hostname = os.hostname();

		if (hostname.includes('local')) {
			return true;
		} else {
			return false;
		}
	});
}

export const config = {
	pathPrefix: "/",
	dir: {
		input: "src/_content/",
		output: "_site",
		includes: "../../src/_includes",
		layouts: "../../src/_layouts",
		data: "src/_data"
	}
}