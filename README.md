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

These are things I learned through the [Critical Rendering Path course](https://www.udacity.com/course/ud884).

The second page, pizza.html can be accessed [here](http://andreicommunication.github.io/Optimized-Portfolio/views/pizza.html). I improved the render performance in the following way:

* Remove unnecessary complexity in the pizza resize slider function. The slider now simply changes
the style of the pizza elements based on a hard mapping, rather than finding the current size (
causing forced synchronous layout) and adjusting relative to that.
* Remove forced synchronous layout on the function that moves the background pizzas. Instead of 
finding the current y-position of the window during the for loop that cycles through each 
pizza element, the function now calculates the values mathematically without ever worrying 
about the position of viewport.

The other pages linked to from index.html have not been changed and can be viewed as examples of how 
the page ran prior to these changes.

### Credits

- Filament Group for their fantastic services in the [asynchronous loading function](https://github.com/filamentgroup/loadCSS) and [guide to loading fonts asynchronously](https://www.filamentgroup.com/lab/font-loading.html).