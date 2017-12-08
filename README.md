# Dubs Visualizer

An interactive shot chart and bubble chart visualization of the Golden State Warriors for 2014-2015, 2015-2016, 2016-2017 seasons. The purpose of Dubs Visualizer is to provide multiple visualizations for how each player shot during each season and how efficient they were.

## Demo
[DubsVisualizer demo](https://mikesalisbury.github.io/DubsVisualizer/)

## Features

![](https://media.giphy.com/media/xUOxeSI1ZbL48wi640/giphy.gif)
### Shot Chart
All shots plotted on court from where shots were taken in game. User can select by season and player to change datapoints to see all shots by season or shots by player for that season.
### Bubble Chart
Bubbles render each player with their image, the size of the bubble is determined by the amount of shots taken by that player.
### Tooltip
All circles will render a tooltip with associated stats on hover.
### Season Slider
User can select which season they would like to see the visualization for by sliding to different seasons.
### Player Dropdown
User can select a player from the dropdown to render only their shots on the shotchart SVG.

## Built With

### HTML5
SVG used to create graphic areas to generate and render circles and bubbles.
### CSS3
All styling handrolled via CSS3.
### d3.js
d3 library used to manipulate DOM and data. d3.scale used to scale data values into readable/sensible points. d3.force used to simulate motion and give force attribute to bubbles to continuously move to center point. d3.drag used to allow bubbles the ability to be dragged around enclosing SVG container.
### Vanilla Javascript
All logic and functions created with vanilla javascript.
## Future Iterations

### API call to fetch data.
To allow for automated and updated data pulling.
### Add additional seasons and update d3.queue to read in data more DRYly
Allow for further interaction by increasing visibility into past historical seasons beyond the 3 included.
### Utilize the dragging feature in a better way
Currently dragging only serves as a fun way to interact with the bubbles and to reposition the elements within the SVG.
### Include d3 transition() on data update
To smoothly transition the update call
