## Website Performance Optimization portfolio project

This is a website that I optimized parts of for performance. 

The first page, index.html can be accessed [here](http://andreicommunication.github.io/Optimized-Portfolio/). I improved the critical rendering path in the following way:

* Run non-essential JavaScript asynchronously.
* Put the CSS that is essential for displaying the first page inline to avoid
a render-blocking call to an external CSS file.
* Remove the call to a webfont. Replace it with another asynchronous script that 
loads the webfonts at a later time along with the rest of the CSS stylesheet that is not
needed for the initial render. This causes a flash of unstyled text but a much faster
usuable page.
* Compress the images using a different, work directory where I use imagemin (Grunt).
* Minify the html (negligible improvement) and inlined CSS.

Most of everything is maintained on this first page using automated Gulp tasks. 

This means that to make changes to this file, it is best to work in the src/ directory and then to have the build tools output the files that can be used for production.

See [gulpfile.js](https://github.com/AndreiCommunication/Optimized-Portfolio/blob/master/gulpfile.js) for the Gulp tasks. If you have npm and node installed you can get all of the tasks that I use 
in this file by running the following commands in the terminal:

```
$ cd to/this/directory/
$ npm install gulp-ruby-sass gulp-autoprefixer gulp-minify-css gulp-jshint gulp-concat gulp-uglify gulp-imagemin gulp-notify gulp-rename gulp-livereload gulp-cache del critical gulp-minify-html --save-dev
```

And once you have the node_module directory that is created by this command, the main functions to run in the terminal are:

```
$ cd to/this/directory/
$ gulp
```
And then, to have Gulp automatically perform all the required function upon changes to any of the source files:
```
$ gulp watch
```

These are things I learned through the [Critical Rendering Path course](https://www.udacity.com/course/ud884).

The second page, pizza.html can be accessed [here](http://andreicommunication.github.io/Optimized-Portfolio/views/pizza.html). I improved the render performance in the following way:

* Remove unnecessary complexity in the pizza resize slider function. The slider now simply changes
the style of the pizza elements based on a hard mapping, rather than finding the current size (
causing forced synchronous layout) and adjusting relative to that.
* Remove forced synchronous layout on the function that moves the background pizzas. Instead of 
finding the current y-position of the window during the for loop that cycles through each 
pizza element, the function now calculates the values mathematically without ever worrying 
about the position of viewport.

If you got the node modules mentioned further up in the README, you can run a JavaScript lint on the main.js file that dynamically generates and updates the page by running the following terminal command in the root directory:
```
$ gulp scan
```

The other pages linked to from index.html have not been changed and can be viewed as examples of how 
the page ran prior to these changes.

### Credits

- Filament Group for their fantastic services in the [asynchronous loading function](https://github.com/filamentgroup/loadCSS) and [guide to loading fonts asynchronously](https://www.filamentgroup.com/lab/font-loading.html).