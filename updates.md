#### January 18th 2016

* Changed resizePizzas function in views/js/main.js to use getElementsById
insteaad of querySelector in order to improve performance.
* Changed changePizzaSizes function in views/js/main.js to use 
getElementsByClassName instead of querySelector in order to improve performance.
* Move the initialization of pizzasDiv out of the pizza generating loop and into
usefulVariables in order to incapsulate it. 