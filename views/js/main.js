/*
main.js in Optimized-Portfolio

This script creates randomized pizzas for a sample website. It handles 
resizing of the pizzas as well as the movement of background pizzas when the 
page is scrolled.

This page is made as part of the Front End Nanodegree at Udacity and uses the 
Udacity template for Project 4.

Authored by Andrei Borissenko
*/

/**
 * @type {Object}
 * Here we hold some variables that are used in performing the scrolling pizza movements 
 * using scrollPos and changing the page for mobile phones to remove the pizza size slider
 * using bigMode.
 * @type {Array} movers is an array of all the moving pizzas made so that they don't have 
 * to be accessed by querying into the DOM each time we want to update them after a scroll
 * This array gets built when the movers are added to the page. 
 * @type {Int} numMovers is the number of moving pizzas and is used when moving through each
 * of the elements to save some milliseconds that would otherwise be required in counting 
 * the length of the movers array.
 */
'use strict';

var usefulVariables = {
    scrollPos: 0,
    bigMode: true,
    movers: [],
    numMovers: 0,
    // Iterator for number of times the pizzas in the background have scrolled.
    // Used by updatePositions() to decide when to log the average time per frame
    frame: 0,
    // This is needed for adding the pizza elements.
    pizzasDiv: document.getElementById('randomPizzas')
};

// As you may have realized, this website randomly generates pizzas.
// Here are arrays of all possible pizza ingredients.
var pizzaIngredients = {};
pizzaIngredients.meats = [
    'Pepperoni',
    'Sausage',
    'Fennel Sausage',
    'Spicy Sausage',
    'Chicken',
    'BBQ Chicken',
    'Chorizo',
    'Chicken Andouille',
    'Salami',
    'Tofu',
    'Bacon',
    'Canadian Bacon',
    'Proscuitto',
    'Italian Sausage',
    'Ground Beef',
    'Anchovies',
    'Turkey',
    'Ham',
    'Venison',
    'Lamb',
    'Duck',
    'Soylent Green',
    'Carne Asada',
    'Soppressata Picante',
    'Coppa',
    'Pancetta',
    'Bresola',
    'Lox',
    'Guanciale',
    'Chili',
    'Beef Jerky',
    'Pastrami',
    'Kielbasa',
    'Scallops',
    'Filet Mignon'
];
pizzaIngredients.nonMeats = [
    'White Onions',
    'Red Onions',
    'Sauteed Onions',
    'Green Peppers',
    'Red Peppers',
    'Banana Peppers',
    'Ghost Peppers',
    'Habanero Peppers',
    'Jalapeno Peppers',
    'Stuffed Peppers',
    'Spinach',
    'Tomatoes',
    'Pineapple',
    'Pear Slices',
    'Apple Slices',
    'Mushrooms',
    'Arugula',
    'Basil',
    'Fennel',
    'Rosemary',
    'Cilantro',
    'Avocado',
    'Guacamole',
    'Salsa',
    'Swiss Chard',
    'Kale',
    'Sun Dried Tomatoes',
    'Walnuts',
    'Artichoke',
    'Asparagus',
    'Caramelized Onions',
    'Mango',
    'Garlic',
    'Olives',
    'Cauliflower',
    'Polenta',
    'Fried Egg',
    'Zucchini',
    'Hummus'
];
pizzaIngredients.cheeses = [
    'American Cheese',
    'Swiss Cheese',
    'Goat Cheese',
    'Mozzarella Cheese',
    'Parmesean Cheese',
    'Velveeta Cheese',
    'Gouda Cheese',
    'Muenster Cheese',
    'Applewood Cheese',
    'Asiago Cheese',
    'Bleu Cheese',
    'Boursin Cheese',
    'Brie Cheese',
    'Cheddar Cheese',
    'Chevre Cheese',
    'Havarti Cheese',
    'Jack Cheese',
    'Pepper Jack Cheese',
    'Gruyere Cheese',
    'Limberger Cheese',
    'Manchego Cheese',
    'Marscapone Cheese',
    'Pecorino Cheese',
    'Provolone Cheese',
    'Queso Cheese',
    'Roquefort Cheese',
    'Romano Cheese',
    'Ricotta Cheese',
    'Smoked Gouda'
];
pizzaIngredients.sauces = [
    'Red Sauce',
    'Marinara',
    'BBQ Sauce',
    'No Sauce',
    'Hot Sauce'
];
pizzaIngredients.crusts = [
    'White Crust',
    'Whole Wheat Crust',
    'Flatbread Crust',
    'Stuffed Crust'
];

/**
 * capitalize operates on a string and capitalizes the first letter of the
 * string. This will be called on individual words to produce a title.
 * Name generator pulled from http://saturdaykid.com/usernames/generator.html
 * @return {string} The string with a capital first letter.
 */
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

/**
 * getAdj pulls adjective out of an array using random number sent from generator
 * @param  {string} x A word that specifies a category of adjectives.
 * @return {array of strings}   An array of adjectives.
 */
function getAdj(x) {
    switch (x) {
        case 'dark':
            var dark = ['dark', 'morbid', 'scary', 'spooky', 'gothic', 'deviant', 'creepy', 'sadistic', 'black', 'dangerous', 'dejected', 'haunted',
                'morose', 'tragic', 'shattered', 'broken', 'sad', 'melancholy', 'somber', 'dark', 'gloomy', 'homicidal', 'murderous', 'shady', 'misty',
                'dusky', 'ghostly', 'shadowy', 'demented', 'cursed', 'insane', 'possessed', 'grotesque', 'obsessed'
            ];
            return dark;
        case 'color':
            var colors = ['blue', 'green', 'purple', 'grey', 'scarlet', 'NeonGreen', 'NeonBlue', 'NeonPink', 'HotPink', 'pink', 'black', 'red',
                'maroon', 'silver', 'golden', 'yellow', 'orange', 'mustard', 'plum', 'violet', 'cerulean', 'brown', 'lavender', 'violet', 'magenta',
                'chestnut', 'rosy', 'copper', 'crimson', 'teal', 'indigo', 'navy', 'azure', 'periwinkle', 'brassy', 'verdigris', 'veridian', 'tan',
                'raspberry', 'beige', 'sandy', 'ElectricBlue', 'white', 'champagne', 'coral', 'cyan'
            ];
            return colors;
        case 'whimsical':
            var whimsy = ['whimsical', 'silly', 'drunken', 'goofy', 'funny', 'weird', 'strange', 'odd', 'playful', 'clever', 'boastful', 'breakdancing',
                'hilarious', 'conceited', 'happy', 'comical', 'curious', 'peculiar', 'quaint', 'quirky', 'fancy', 'wayward', 'fickle', 'yawning', 'sleepy',
                'cockeyed', 'dizzy', 'dancing', 'absurd', 'laughing', 'hairy', 'smiling', 'perplexed', 'baffled', 'cockamamie', 'vulgar', 'hoodwinked',
                'brainwashed'
            ];
            return whimsy;
        case 'shiny':
            var shiny = ['sapphire', 'opal', 'silver', 'gold', 'platinum', 'ruby', 'emerald', 'topaz', 'diamond', 'amethyst', 'turquoise',
                'starlit', 'moonlit', 'bronze', 'metal', 'jade', 'amber', 'garnet', 'obsidian', 'onyx', 'pearl', 'copper', 'sunlit', 'brass', 'brassy',
                'metallic'
            ];
            return shiny;
        case 'noisy':
            var noisy = ['untuned', 'loud', 'soft', 'shrieking', 'melodious', 'musical', 'operatic', 'symphonic', 'dancing', 'lyrical', 'harmonic',
                'orchestral', 'noisy', 'dissonant', 'rhythmic', 'hissing', 'singing', 'crooning', 'shouting', 'screaming', 'wailing', 'crying', 'howling',
                'yelling', 'hollering', 'caterwauling', 'bawling', 'bellowing', 'roaring', 'squealing', 'beeping', 'knocking', 'tapping', 'rapping',
                'humming', 'scatting', 'whispered', 'whispering', 'rasping', 'buzzing', 'whirring', 'whistling', 'whistled'
            ];
            return noisy;
        case 'apocalyptic':
            var apocalyptic = ['nuclear', 'apocalyptic', 'desolate', 'atomic', 'zombie', 'collapsed', 'grim', 'fallen', 'collapsed', 'cannibalistic',
                'radioactive', 'toxic', 'poisonous', 'venomous', 'disastrous', 'grimy', 'dirty', 'undead', 'bloodshot', 'rusty', 'glowing', 'decaying',
                'rotten', 'deadly', 'plagued', 'decimated', 'rotting', 'putrid', 'decayed', 'deserted', 'acidic'
            ];
            return apocalyptic;
        case 'insulting':
            var insulting = ['stupid', 'idiotic', 'fat', 'ugly', 'hideous', 'grotesque', 'dull', 'dumb', 'lazy', 'sluggish', 'brainless', 'slow',
                'gullible', 'obtuse', 'dense', 'dim', 'dazed', 'ridiculous', 'witless', 'daft', 'crazy', 'vapid', 'inane', 'mundane', 'hollow', 'vacuous',
                'boring', 'insipid', 'tedious', 'monotonous', 'weird', 'bizarre', 'backward', 'moronic', 'ignorant', 'scatterbrained', 'forgetful', 'careless',
                'lethargic', 'insolent', 'indolent', 'loitering', 'gross', 'disgusting', 'bland', 'horrid', 'unseemly', 'revolting', 'homely', 'deformed',
                'disfigured', 'offensive', 'cowardly', 'weak', 'villainous', 'fearful', 'monstrous', 'unattractive', 'unpleasant', 'nasty', 'beastly', 'snide',
                'horrible', 'syncophantic', 'unhelpful', 'bootlicking'
            ];
            return insulting;
        case 'praise':
            var praise = ['beautiful', 'intelligent', 'smart', 'genius', 'ingenious', 'gorgeous', 'pretty', 'witty', 'angelic', 'handsome', 'graceful',
                'talented', 'exquisite', 'enchanting', 'fascinating', 'interesting', 'divine', 'alluring', 'ravishing', 'wonderful', 'magnificient', 'marvelous',
                'dazzling', 'cute', 'charming', 'attractive', 'nifty', 'delightful', 'superior', 'amiable', 'gentle', 'heroic', 'courageous', 'valiant', 'brave',
                'noble', 'daring', 'fearless', 'gallant', 'adventurous', 'cool', 'enthusiastic', 'fierce', 'awesome', 'radical', 'tubular', 'fearsome',
                'majestic', 'grand', 'stunning'
            ];
            return praise;
        case 'scientific':
            var scientific = ['scientific', 'technical', 'digital', 'programming', 'calculating', 'formulating', 'cyberpunk', 'mechanical', 'technological',
                'innovative', 'brainy', 'chemical', 'quantum', 'astro', 'space', 'theoretical', 'atomic', 'electronic', 'gaseous', 'investigative', 'solar',
                'extinct', 'galactic'
            ];
            return scientific;
        default:
            var scientificDefault = ['scientific', 'technical', 'digital', 'programming', 'calculating', 'formulating', 'cyberpunk', 'mechanical', 'technological',
                'innovative', 'brainy', 'chemical', 'quantum', 'astro', 'space', 'theoretical', 'atomic', 'electronic', 'gaseous', 'investigative', 'solar',
                'extinct', 'galactic'
            ];
            return scientificDefault;
    }
}

/**
 * getNoun pulls noun out of an array using random number sent from generator
 * @param  {string} x A word that specifies a category of nouns.
 * @return {array of strings}   An array of nouns.
 */
function getNoun(y) {
    switch (y) {
        case 'animals':
            var animals = ['flamingo', 'hedgehog', 'owl', 'elephant', 'pussycat', 'alligator', 'dachsund', 'poodle', 'beagle', 'crocodile', 'kangaroo',
                'wallaby', 'woodpecker', 'eagle', 'falcon', 'canary', 'parrot', 'parakeet', 'hamster', 'gerbil', 'squirrel', 'rat', 'dove', 'toucan',
                'raccoon', 'vulture', 'peacock', 'goldfish', 'rook', 'koala', 'skunk', 'goat', 'rooster', 'fox', 'porcupine', 'llama', 'grasshopper',
                'gorilla', 'monkey', 'seahorse', 'wombat', 'wolf', 'giraffe', 'badger', 'lion', 'mouse', 'beetle', 'cricket', 'nightingale',
                'hawk', 'trout', 'squid', 'octopus', 'sloth', 'snail', 'locust', 'baboon', 'lemur', 'meerkat', 'oyster', 'frog', 'toad', 'jellyfish',
                'butterfly', 'caterpillar', 'tiger', 'hyena', 'zebra', 'snail', 'pig', 'weasel', 'donkey', 'penguin', 'crane', 'buzzard', 'vulture',
                'rhino', 'hippopotamus', 'dolphin', 'sparrow', 'beaver', 'moose', 'minnow', 'otter', 'bat', 'mongoose', 'swan', 'firefly', 'platypus'
            ];
            return animals;
        case 'profession':
            var professions = ['doctor', 'lawyer', 'ninja', 'writer', 'samurai', 'surgeon', 'clerk', 'artist', 'actor', 'engineer', 'mechanic',
                'comedian', 'fireman', 'nurse', 'RockStar', 'musician', 'carpenter', 'plumber', 'cashier', 'electrician', 'waiter', 'president', 'governor',
                'senator', 'scientist', 'programmer', 'singer', 'dancer', 'director', 'mayor', 'merchant', 'detective', 'investigator', 'navigator', 'pilot',
                'priest', 'cowboy', 'stagehand', 'soldier', 'ambassador', 'pirate', 'miner', 'police'
            ];
            return professions;
        case 'fantasy':
            var fantasy = ['centaur', 'wizard', 'gnome', 'orc', 'troll', 'sword', 'fairy', 'pegasus', 'halfling', 'elf', 'changeling', 'ghost',
                'knight', 'squire', 'magician', 'witch', 'warlock', 'unicorn', 'dragon', 'wyvern', 'princess', 'prince', 'king', 'queen', 'jester',
                'tower', 'castle', 'kraken', 'seamonster', 'mermaid', 'psychic', 'seer', 'oracle'
            ];
            return fantasy;
        case 'music':
            var music = ['violin', 'flute', 'bagpipe', 'guitar', 'symphony', 'orchestra', 'piano', 'trombone', 'tuba', 'opera', 'drums',
                'harpsichord', 'harp', 'harmonica', 'accordion', 'tenor', 'soprano', 'baritone', 'cello', 'viola', 'piccolo', 'ukelele', 'woodwind', 'saxophone',
                'bugle', 'trumpet', 'sousaphone', 'cornet', 'stradivarius', 'marimbas', 'bells', 'timpani', 'bongos', 'clarinet', 'recorder', 'oboe', 'conductor',
                'singer'
            ];
            return music;
        case 'horror':
            var horror = ['murderer', 'chainsaw', 'knife', 'sword', 'murder', 'devil', 'killer', 'psycho', 'ghost', 'monster', 'godzilla', 'werewolf',
                'vampire', 'demon', 'graveyard', 'zombie', 'mummy', 'curse', 'death', 'grave', 'tomb', 'beast', 'nightmare', 'frankenstein', 'specter',
                'poltergeist', 'wraith', 'corpse', 'scream', 'massacre', 'cannibal', 'skull', 'bones', 'undertaker', 'zombie', 'creature', 'mask', 'psychopath',
                'fiend', 'satanist', 'moon', 'fullMoon'
            ];
            return horror;
        case 'gross':
            var gross = ['slime', 'bug', 'roach', 'fluid', 'pus', 'booger', 'spit', 'boil', 'blister', 'orifice', 'secretion', 'mucus', 'phlegm',
                'centipede', 'beetle', 'fart', 'snot', 'crevice', 'flatulence', 'juice', 'mold', 'mildew', 'germs', 'discharge', 'toilet', 'udder', 'odor', 'substance',
                'fluid', 'moisture', 'garbage', 'trash', 'bug'
            ];
            return gross;
        case 'everyday':
            var everyday = ['mirror', 'knife', 'fork', 'spork', 'spoon', 'tupperware', 'minivan', 'suburb', 'lamp', 'desk', 'stereo', 'television', 'TV',
                'book', 'car', 'truck', 'soda', 'door', 'video', 'game', 'computer', 'calender', 'tree', 'plant', 'flower', 'chimney', 'attic', 'kitchen',
                'garden', 'school', 'wallet', 'bottle'
            ];
            return everyday;
        case 'jewelry':
            var jewelry = ['earrings', 'ring', 'necklace', 'pendant', 'choker', 'brooch', 'bracelet', 'cameo', 'charm', 'bauble', 'trinket', 'jewelry',
                'anklet', 'bangle', 'locket', 'finery', 'crown', 'tiara', 'blingBling', 'chain', 'rosary', 'jewel', 'gemstone', 'beads', 'armband', 'pin',
                'costume', 'ornament', 'treasure'
            ];
            return jewelry;
        case 'places':
            var places = ['swamp', 'graveyard', 'cemetery', 'park', 'building', 'house', 'river', 'ocean', 'sea', 'field', 'forest', 'woods', 'neighborhood',
                'city', 'town', 'suburb', 'country', 'meadow', 'cliffs', 'lake', 'stream', 'creek', 'school', 'college', 'university', 'library', 'bakery',
                'shop', 'store', 'theater', 'garden', 'canyon', 'highway', 'restaurant', 'cafe', 'diner', 'street', 'road', 'freeway', 'alley'
            ];
            return places;
        case 'scifi':
            var scifi = ['robot', 'alien', 'raygun', 'spaceship', 'UFO', 'rocket', 'phaser', 'astronaut', 'spaceman', 'planet', 'star', 'galaxy',
                'computer', 'future', 'timeMachine', 'wormHole', 'timeTraveler', 'scientist', 'invention', 'martian', 'pluto', 'jupiter', 'saturn', 'mars',
                'quasar', 'blackHole', 'warpDrive', 'laser', 'orbit', 'gears', 'molecule', 'electron', 'neutrino', 'proton', 'experiment', 'photon', 'apparatus',
                'universe', 'gravity', 'darkMatter', 'constellation', 'circuit', 'asteroid'
            ];
            return scifi;
        default:
            var scifiDefault = ['robot', 'alien', 'raygun', 'spaceship', 'UFO', 'rocket', 'phaser', 'astronaut', 'spaceman', 'planet', 'star', 'galaxy',
                'computer', 'future', 'timeMachine', 'wormHole', 'timeTraveler', 'scientist', 'invention', 'martian', 'pluto', 'jupiter', 'saturn', 'mars',
                'quasar', 'blackHole', 'warpDrive', 'laser', 'orbit', 'gears', 'molecule', 'electron', 'neutrino', 'proton', 'experiment', 'photon', 'apparatus',
                'universe', 'gravity', 'darkMatter', 'constellation', 'circuit', 'asteroid'
            ];
            return scifiDefault;
    }
}

var adjectives = ['dark', 'color', 'whimsical', 'shiny', 'noise', 'apocalyptic', 'insulting', 'praise', 'scientific']; // types of adjectives for pizza titles
var nouns = ['animals', 'everyday', 'fantasy', 'gross', 'horror', 'jewelry', 'places', 'scifi']; // types of nouns for pizza titles

// Generates random numbers for getAdj and getNoun functions and returns a new pizza name
/**
 * generator makes random numbers for getAdj and getNoun functions and returns 
 * a new pizza name.
 * @param  {string} adj  A category of adjectives.
 * @param  {string} noun A category of nouns.
 * @return {string}      The name of a pizza using a capitalized form of an 
 *                           adjective and a noun.
 */
function generator(adj, noun) {
    var adjectives = getAdj(adj);
    var nouns = getNoun(noun);
    var randomAdjective = parseInt(Math.random() * adjectives.length);
    var randomNoun = parseInt(Math.random() * nouns.length);
    var name = 'The ' + adjectives[randomAdjective].capitalize() + ' ' + nouns[randomNoun].capitalize();
    return name;
}

// Chooses random adjective and random noun
/**
 * randomName picks a random category of adjective and noun and then passes 
 * these to generator in order to create a name for a new pizza.
 * @return {string} The name of a pizza.
 */
function randomName() {
    var randomNumberAdj = parseInt(Math.random() * adjectives.length);
    var randomNumberNoun = parseInt(Math.random() * nouns.length);
    return generator(adjectives[randomNumberAdj], nouns[randomNumberNoun]);
}

/**
 * All the functions below return a string of a random ingredient from each 
 * respective category of ingredients. 
 * @return {string} an ingredient
 */
var selectRandomMeat = function() {
    var randomMeat = pizzaIngredients.meats[Math.floor((Math.random() * pizzaIngredients.meats.length))];
    return randomMeat;
};

var selectRandomNonMeat = function() {
    var randomNonMeat = pizzaIngredients.nonMeats[Math.floor((Math.random() * pizzaIngredients.nonMeats.length))];
    return randomNonMeat;
};

var selectRandomCheese = function() {
    var randomCheese = pizzaIngredients.cheeses[Math.floor((Math.random() * pizzaIngredients.cheeses.length))];
    return randomCheese;
};

var selectRandomSauce = function() {
    var randomSauce = pizzaIngredients.sauces[Math.floor((Math.random() * pizzaIngredients.sauces.length))];
    return randomSauce;
};

var selectRandomCrust = function() {
    var randomCrust = pizzaIngredients.crusts[Math.floor((Math.random() * pizzaIngredients.crusts.length))];
    return randomCrust;
};

var ingredientItemizer = function(string) {
    return '<li>' + string + '</li>';
};

/**
 * makeRandomPizza returns a string of random pizza ingredients nested inside
 * <li> tags.
 * @return {string} This string is valid html and should be placed in a list.
 */
var makeRandomPizza = function() {
    var pizza = '';

    var numberOfMeats = Math.floor((Math.random() * 4));
    var numberOfNonMeats = Math.floor((Math.random() * 3));
    var numberOfCheeses = Math.floor((Math.random() * 2));

    for (var i = 0; i < numberOfMeats; i++) {
        pizza = pizza + ingredientItemizer(selectRandomMeat());
    }

    for (var j = 0; j < numberOfNonMeats; j++) {
        pizza = pizza + ingredientItemizer(selectRandomNonMeat());
    }

    for (var k = 0; k < numberOfCheeses; k++) {
        pizza = pizza + ingredientItemizer(selectRandomCheese());
    }

    pizza = pizza + ingredientItemizer(selectRandomSauce());
    pizza = pizza + ingredientItemizer(selectRandomCrust());

    return pizza;
};

// returns a DOM element for each pizza
/**
 * pizzaElementGenerator returns a DOM element for each pizza
 * @param  {int} i a number that will be used to create a unique id for each 
 *                 element
 * @return {div element}   A DOM element that has a random pizza name, a pizza 
 *                          image, and a list of ingredients.
 */
var pizzaElementGenerator = function(i) {
    var pizzaContainer, // contains pizza title, image and list of ingredients
        pizzaImageContainer, // contains the pizza image
        pizzaImage, // the pizza image itself
        pizzaDescriptionContainer, // contains the pizza title and list of ingredients
        pizzaName, // the pizza name itself
        ul; // the list of ingredients

    pizzaContainer = document.createElement('div');
    pizzaImageContainer = document.createElement('div');
    pizzaImage = document.createElement('img');
    pizzaDescriptionContainer = document.createElement('div');

    pizzaContainer.classList.add('randomPizzaContainer');
    pizzaContainer.style.width = '33.33%';
    pizzaContainer.style.height = '325px';
    pizzaContainer.id = 'pizza' + i; // gives each pizza element a unique id
    pizzaImageContainer.classList.add('col-md-6');
    /**
     * Here I added this class in order to make the pizzaImage next to each generated 
     * pizza list disappear on smaller viewports. Not entirely necessary as the site 
     * is still horrible for mobile but it was an easy change to take it from 
     * unusable to just bad.
     */
    pizzaImageContainer.classList.add('pizzaImage');

    pizzaImage.src = 'images/pizza.png';
    pizzaImage.classList.add('img-responsive');
    pizzaImageContainer.appendChild(pizzaImage);
    pizzaContainer.appendChild(pizzaImageContainer);


    pizzaDescriptionContainer.classList.add('col-md-6');

    pizzaName = document.createElement('h4');
    pizzaName.innerHTML = randomName();
    pizzaDescriptionContainer.appendChild(pizzaName);

    ul = document.createElement('ul');
    ul.innerHTML = makeRandomPizza();
    pizzaDescriptionContainer.appendChild(ul);
    pizzaContainer.appendChild(pizzaDescriptionContainer);

    return pizzaContainer;
};

/**
 * resizePizzas is called when the slider in 'Our Pizzas' section of the website
 * moves. 
 * @param  {int} size A number indicating how big the pizzas should be. 
 */
var resizePizzas = function(size) {
    window.performance.mark('mark_start_resize'); // User Timing API function

    /* Changes the value for the size of the pizza above the slider.
     * Edited to use getElementById instead of querySelector in an effort to
     * improve performance.
     */  
     
    function changeSliderLabel(size) {
        switch (size) {
            case '1':
                document.getElementById('pizzaSize').innerHTML = 'Small';
                return;
            case '2':
                document.getElementById('pizzaSize').innerHTML = 'Medium';
                return;
            case '3':
                document.getElementById('pizzaSize').innerHTML = 'Large';
                return;
            default:
                console.log('bug in changeSliderLabel');
        }
    }

    changeSliderLabel(size);

    /**
     * sizeSwitcher is a helper function that will feed into changePizzaSizes.
     * @param  {int} size is a number between 1-3 that comes from resizePizzas.
     * @return {string} a percentage that will inform the size of each pizza 
     *                    element.
     */
    function sizeSwitcher(size) {
        switch (size) {
            case '1':
                return '25%';
            case '2':
                return '33.333%';
            case '3':
                return '50%';
            default:
                console.log('bug in sizeSwitcher');
        }
    }

    /**
     * changePizzaSizes finds a new size percentage for the pizzas using 
     * sizeSwitcher and then changes the style of all the elements that have the 
     * appropriate class. Edited to use getElementsByClassName instead of 
     * querySelectorAll in order to improve performance.
     * @param  {int} size [a number between 1-3 that comes from resizePizzas]
     */
    function changePizzaSizes(size) {
        var newSize = sizeSwitcher(size);
        var allPizzas = document.getElementsByClassName('randomPizzaContainer');
        var length = allPizzas.length;
        for (var i = 0; i < length; i++) {
            allPizzas[i].style.width = newSize;
        }
    }

    changePizzaSizes(size);

    // User Timing API is awesome
    window.performance.mark('mark_end_resize');
    window.performance.measure('measure_pizza_resize', 'mark_start_resize', 'mark_end_resize');
    var timeToResize = window.performance.getEntriesByName('measure_pizza_resize');
    console.log('Time to resize pizzas: ' + timeToResize[0].duration + 'ms');
};

window.performance.mark('mark_start_generating'); // collect timing data

/**
 * The initialization of pizzasDiv has been moved out of this loop and into the 
 * usefulVariables object.
 *
 * This for loop adds all the random pizzas to the DOM.
 */
for (var i = 2; i < 100; i++) {
    usefulVariables.pizzasDiv.appendChild(pizzaElementGenerator(i));
}

// User Timing API again. These measurements tell you how long it took to generate the initial pizzas
window.performance.mark('mark_end_generating');
window.performance.measure('measure_pizza_generation', 'mark_start_generating', 'mark_end_generating');
var timeToGenerate = window.performance.getEntriesByName('measure_pizza_generation');
console.log('Time to generate pizzas on load: ' + timeToGenerate[0].duration + 'ms');

/* Moved initialization of frame to usefulVariables for incapsulation. */

/**
 * logAverageFrame logs the average amount of time per 10 frames needed to move 
 * the sliding background pizzas on scroll.
 * @param  {array} times An array of User Timing Measurements from 
 *                       updatePositions()
 */
function logAverageFrame(times) { 
    var numberOfEntries = times.length;
    var sum = 0;
    for (var i = numberOfEntries - 1; i > numberOfEntries - 11; i--) {
        sum = sum + times[i].duration;
    }
    console.log('Average time to generate last 10 frames: ' + sum / 10 + 'ms');
}

/* The following code for sliding background pizzas was pulled from Ilya's demo 
found at:
https://www.igvita.com/slides/2012/devtools-tips-and-tricks/jank-demo.html */

/**
 * updatePositions moves the sliding background pizzas based on scroll position
 * @param  {int} initial is an optional variable that, when specfied as '1' 
 *                       causes a separate for loop to run that initilizizes the 
 *                       positions of the scrolling pizzas for when the page 
 *                       loads
 */
function updatePositions(initial) {
    usefulVariables.frame++;
    window.performance.mark('mark_start_frame');
    /**
     * Increment the scrollPos by the same amount that a single scroll action 
     * on my mousewheel changes the location of my the viewport vertically.
     */
    usefulVariables.scrollPos += 53;

    /**
     * Take the current scrollPos as we will be using it to inform how the
     * pizzas should move in a subsequent for-loop.
     * @type {int}
     */
    var scrollLocation = usefulVariables.scrollPos;
    /**
     * Thank you to chris_838012 on the forum for pointing this out (and to his
     * reviewer who recommended the solution of holding an array of phase values): 
     * https://discussions.udacity.com/t/frame-rate-confusion/31262/9
     * @type {Array}
     */
    var phases = [];
    for (var b = 0; b < 5; b++) {
        phases.push(Math.sin((scrollLocation / 1250) + b));
    }

    // Commented out old length value:.
    // var length = usefulVariables.numMovers;

    // Variable will be used to keep track of the movements of background pizzas
    // in the following for loop.
    var phase;

    /**
     * Use the phases from the phases array to move each of the .mover pizzas 
     * in the backgroung through a sinusoidal loop.
     * Edited to move len in as a local variable for increased efficiency.
     * In the initial call to this function, we set pizza positions using 
     * basicLeft and then move on just moving them through a regular pattern.
     */
    if (initial == 1) {
        for (var i = 0, len = usefulVariables.numMovers; i < len; i++) {
            phase = phases[i % 5];
            usefulVariables.movers[i].style.left = (usefulVariables.movers[i].basicLeft +
                100 * phase + 'px');
        }
    } else {
        for (var i = 0, len = usefulVariables.numMovers; i < len; i++) {
        phase = phases[i % 5];
        usefulVariables.movers[i].style.transform = 'translate( ' + phase * 100 + 'px, 0)';
    }
    }
    


    // User Timing API to the rescue again. Seriously, it's worth learning.
    // Super easy to create custom metrics.
    window.performance.mark('mark_end_frame');
    window.performance.measure('measure_frame_duration', 'mark_start_frame', 'mark_end_frame');
    if (usefulVariables.frame % 10 === 0) {
        var timesToUpdatePosition = window.performance.getEntriesByName('measure_frame_duration');
        logAverageFrame(timesToUpdatePosition);
    }
}

// runs updatePositions on scroll
window.addEventListener('scroll', updatePositions);

/**
 * Generates the sliding pizzas when the page loads.
 */
document.addEventListener('DOMContentLoaded', function() {
    var cols = 8;
    var s = 256;
    var elem;
    var target = document.getElementById('movingPizzas1');
    /* Edited to generate an appropriate number of pizzas depending on how tall
    the screen is. */    
    var screenHeight = window.screen.height;
    var moverHeight = 225;
    var numRows = Math.floor(screenHeight / moverHeight);
    var numPizzas = numRows * cols;
    
    for (var i = 0; i < numPizzas; i++) {
        elem = document.createElement('img');
        elem.className = 'mover';
        elem.src = 'images/pizza.png';
        elem.style.height = '100px';
        elem.style.width = '73.333px';
        elem.basicLeft = (i % cols) * s;
        elem.style.top = (Math.floor(i / cols) * s) + 'px';
        target.appendChild(elem);
        /**
         * This is a recommendation brought up in the following office hours discussion:
         * https://github.com/udacity/fend-office-hours/tree/master/Web%20Optimization/Effective%20Optimizations%20for%2060%20FPS
         * It allows us to keep an array of the moving pizzas so that they do 
         * not get queried for in the DOM each time the page is scrolled.
         */
        usefulVariables.movers.push(elem);
        usefulVariables.numMovers++;

    }
    updatePositions(1);
});

/**
 * displayChanger runs whenever the width of the <body> changes. It resizes the 
 * pizzas so that they take up an appropriate amount of space on smaller 
 * displays where it is not possible to use the pizza slider (due to large sizes
 * generating ugliness)
 */
function displayChanger() {
    var currentWindowSize = window.innerWidth;
    if (currentWindowSize <= 750 && usefulVariables.bigMode) {
        usefulVariables.bigMode = false;
        resizePizzas('3');
    } else if (currentWindowSize >= 751 && !usefulVariables.bigMode) {
        usefulVariables.bigMode = true;
        resizePizzas('2');
    }
}

/**
 * Run to change the display on smaller screens when the page first loads.
 */
displayChanger();
