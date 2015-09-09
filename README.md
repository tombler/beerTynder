# BeerTynder

## About

This is a mobile app based off the popular dating app, Tinder. Our application allows users to swipe through randomly generated beers from around the world, view detailed information about those beers, and add to personal lists. By tapping the "Social" tab, users can view other users' selected beers and add to their own wishlists. Users can also search from the BreweryDB (http://www.brewerydb.com/) database of beers to add a beer manually. This is a collaborative project with other Nashville Software School students.

## Changes & Notes

User authentication functions in browser testing, but mobile phones do not support certain OAuth and Firebase methods. Therefore, the app can only currently be tested in the browser. In future versions, we plan to allow users to authenticate via phone, as well as develop other features such as categorical searching and greater user interaction.

## Frameworks, Libraries, Plugins, and Other Dependencies

* AngularJS
* Ionic
* AngularFire
* AngularRoute
* Firebase
* JQuery

## Installation

To view this application and its code, run:

* `git clone https://github.com/tombler/beerTynder.git`
* Run `sudo npm install -g cordova` and `sudo npm install -g ionic`
* Run `npm install -g corsproxy` (installs corsproxy to allow AJAX calls to function)

## Serving

* From your project directory, run `ionic serve`.
* From a separate tab or window in your CLI, run `corsproxy`

## Contact

https://github.com/tombler/


