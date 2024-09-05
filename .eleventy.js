const os = require('os');
const dumpFilter = require("@jamshop/eleventy-filter-dump");

module.exports = function (config) {
	// 11ty uses gitignore to ignore watching files. Disable this.
	config.setUseGitIgnore(false);

	// We're setting 11ty to build when scss/js is updated, but we want a delay so that the assets have time to build
	config.setWatchThrottleWaitTime(120);

	//--- Plugins
	config.addFilter("dump", dumpFilter);

	//--- Misc Options
	// Additional files to watch for changes
	config.addWatchTarget("src/scss/**/*.scss");
	config.addWatchTarget("src/js/**/*.js");

	//--- Adds CSS/JS to _site
	config.addPassthroughCopy({ "_dist/main.css": "css/main.css" });
	config.addPassthroughCopy({ "_dist/main.js": "js/main.js" });

	//--- Adds Favicons to _site
	config.addPassthroughCopy({ "src/favicons": "favicons" });

	//--- Adds images to _site
	config.addPassthroughCopy({ "src/img": "img" });

	//--- Adds fonts to _site
	config.addPassthroughCopy({ "src/fonts": "fonts" });

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