#### January 18th 2016

**Changes inside views/js/main.js**
* Changed resizePizzas function to use getElementsById instead of querySelector 
in order to improve performance.
* Changed changePizzaSizes function to use getElementsByClassName instead of 
querySelector in order to improve performance.
* Move the initialization of pizzasDiv out of the pizza generating loop and into
usefulVariables in order to incapsulate it. 
* Move the frames variable into usefulVariables for incapsulation. 
* Made len a local variable inside updatePositions for loop
* Decleared phase variable outside of loop in updatePositions.
* Changed number of pizzas to accomodate the screen size of the device that 
the website if opened on.
* Do not create a new elem variable during each loop in the "DOMContentLoaded" 
listener.
* Get access to #movingPizzas1 before entering loop to avoid unnecessary DOM 
calls.
* Created an optional variable for updatePositions that is run on the first 
call to the function in order to position the pizzas initially as part of the 
`DOMContentLoaded` handler.
* Made all comments for functions conform to JSDoc style.
* Fixed minor errors in updatePositions to do with == instead of === and 
redefinitions of `i` and `len` variables.

**Changes inside views/css/style.css**
* Added will-change: transform to mover class.
* Removed transform: translateZ(0) hack in order to allow for better performance
on phones with weak GPUs.