  import * as d3 from 'd3';

  // window.onload = function (){
  //   document.getElementById('season-slider').addEventListener('change', updatedata());
  // };

  var sliderValue = d3.select('#season-slider');
  sliderValue.on('change', function() { updateData(); });

  var season = sliderValue._groups[0][0].value;

  var q = d3.queue()
  .defer(d3.csv, './data/warriors_2016_2017.csv')
  .await(ready);


  function updateData() {
    season = sliderValue._groups[0][0].value;

    var seasonheader = document.getElementById('selected-season');

    if (season === '2015') {
      seasonheader.innerText = `2015-2016 season`;
      q = d3.queue()
      .defer(d3.csv, './data/warriors_2015_2016.csv')
      .await(ready);

    } else if (season === '2014') {
      seasonheader.innerText = `2014-2015 season`;
      q = d3.queue()
      .defer(d3.csv, './data/warriors_2014_2015.csv')
      .await(ready);

    } else if (season === '2016') {
      seasonheader.innerText = `2016-2017 season`;
      q = d3.queue()
      .defer(d3.csv, './data/warriors_2016_2017.csv')
      .await(ready);

    }
  }

function ready(error, data) {

  d3.select('#shotchart-canvas').selectAll('*').remove();
  d3.select('#bubble-chart-canvas').selectAll('*').remove();
  d3.select('#selected-player').selectAll('*').remove();

    var defs = d3.select('#bubble-chart-canvas').append('defs');

      defs.append("pattern")
        .attr("id", "Stephen-Curry")
        .attr("height", "100%")
        .attr("width", "100%")
        .attr("patternContentUnits", "objectBoundingBox")
        .append("image")
        .attr("height", 1)
        .attr("weight", 1)
        .attr("preserveAspectRadio", "none")
        .attr("xmlns:xlink", "http://w3.org/1999/xlink")
        .attr("xlink:href", "./assets/stephen_curry.png");

    var xScale = d3.scaleLinear()
      .domain([-248, 246])
      .range([85, 760]);

    var yScale = d3.scaleLinear()
      .domain([-40, 743])
      .range([95, 1150]);

    var shots = d3.select('#shotchart-canvas')
      .selectAll('g')
      .data(data)
      .enter()
      .append('g')
        .attr('class', 'shot')
        .attr('transform', function(d) {
          return "translate(" + xScale(d.x) + "," + yScale(d.y) + ")";
        })
      .on('mouseover', function(d) {
        tooltip.html(
           "Player Name: " + d.name + "<br/>" +
           "Shot Distance: " + d.shot_distance + "ft <br/>" +
           "Shot Type: " + d.action_type + "<br/>" +
           "Points: " + d.shot_type.slice(0, 3))
        .style('opacity', 1.0);
        })

      .on('mousemove', function() {
        return tooltip
          .style('top', (d3.event.pageY - 100) + 'px')
          .style('left', (d3.event.pageX - 100) + 'px');
      })

      .on('mouseout', function(d) {
          tooltip.style('opacity', 0);
      });

    shots.append("circle")
      .attr('r', 5)
      .attr('fill', function(d) {
        if (d.shot_made_flag == 1) {
          return 'green';
        } else {
          return 'red';
        }})
      .attr('stroke', 'black');

    var players = d3.nest()
      .key(function(d) { return d.name; })
      .rollup(function(arr) { return arr.length; })
      .entries(data);

    players.unshift({'key': 'ALL',
      'value': d3.sum(players, function(d) { return d.value; })
    });

    var playerFG = d3.nest()
      .key(function(d) { return d.name; })
      .rollup(function(arr) { return d3.sum(arr, function(d) {
        return d.shot_made_flag;
      });  })
      .entries(data);

    players.map(player1 => {
      playerFG.forEach(player2 => {
        if (player1.key === player2.key) {
          player1.fg = ((player2.value / player1.value) * 100);
        }
      });
    });

    players.map(player1 => {
      data.forEach(player2 => {
        if (player1.key === player2.name) {
          player1.player_img = player2.player_img;
        }
      });
    });
    var selectedPlayer = d3.select('#selected-player');

    selectedPlayer
      .selectAll('option')
      .data(players)
      .enter()
      .append('option')
        .text(function(d) { return d.key + " : " + d.value + ' shots'; })
        .attr('value', function(d) { return d.key; });

    selectedPlayer
      .on('change', function() {
        d3.selectAll(".shot")
          .attr('visibility', 'visible');
        var value = selectedPlayer.property('value');
          if (value != 'ALL') {
            d3.selectAll('.shot')
              .filter(function(d) { return d.name != value; })
              .attr('visibility', 'hidden');
          }
      });

      var onlyPlayers = players.slice(1);

      var scaleRadius = d3.scaleLinear()
          .domain([d3.min(onlyPlayers, function(d) { return +d.value; }),
                  d3.max(onlyPlayers, function(d) { return +d.value; })])
          .range([20, 120]);

          defs.selectAll(".player-pattern")
             .data(onlyPlayers)
             .enter()
             .append("pattern")
             .attr("class", "player-pattern")
             .attr("id", function(d){
               return d.key.replace(/ /g,"-");
             })
             .attr("height", "100%")
             .attr("width", "100%")
             .attr("patternContentUnits", "objectBoundingBox")
             .append("image")
             .attr("height", 1)
             .attr("weight", 1)
             .attr("preserveAspectRadio", "none")
             .attr("xmlns:xlink", "http://w3.org/1999/xlink")
             .attr("xlink:href", function (d) {
               return `${d.player_img}`;
             });

      var bubbles = d3.select('#bubble-chart-canvas')
        .selectAll('g')
        .data(onlyPlayers)
        .enter()
        .append('g')
        .append('circle')
          .attr('class', 'bubble-chart-node')
          .attr('r', function(d) {
            return scaleRadius(d.value);
          })
          .attr("fill", function(d) {
            return "url(#" + d.key.replace(/ /g,"-") + ")";
          })
          // .attr('fill', 'blue')
          .attr('stroke', 'blue')
          .attr('stroke-width', '3px')
          .attr('transform', 'translate(' + [0, 0] + ')')

        .on('mouseover', function(d) {
          tooltip.html(
             "Player Name: " + d.key + "<br/>" +
             "Total Shots: " + d.value + "<br/>" +
             "FG%: " + d.fg.toFixed(2) + "%<br/>")
          .style('opacity', 1.0);
          })

        .on('mouseout', function() {
          tooltip.style('opacity', 0);
        })

        .on('mousemove', function() {
          // var xPos = d3.mouse(this)[0] - 15;
          // var yPos = d3.mouse(this)[1] - 55;
          // tooltip.attr('transform', 'translate(' + xPos +',' + yPos +')');
          return tooltip
            .style('top', (d3.event.pageY - 100) + 'px')
            .style('left', (d3.event.pageX - 100) + 'px');
        });

      var tooltip = d3.select('body')
         .append("div")
         .attr('class', 'tooltip')
         .style('position', 'absolute')
         .style("color", "white")
         .style("padding", "8px")
         .style("background-color", "blue")
         .style("border-radius", "6px")
         .style("text-align", "left")
         .style("font-family", "monospace")
         .style("width", "auto")
         .style('opacity', 0);

      var simulation = d3.forceSimulation()
      .force("charge", d3.forceManyBody().strength([50]))
      .force('center', d3.forceCenter(820/ 2, 643 / 2))
      .force('collide', d3.forceCollide(function(d) {
        return scaleRadius(d.value) + 2;
      }));
      // .force("x", d3.forceX(643 / 2).strength(0.05))
      // .force("y", d3.forceY(820/ 2).strength(0.05))
      // .force('collide', d3.forceCollide( function(d) {
      //   return scaleRadius(d.value) + 1;
      // }));
      // .on("tick", ticked);

      function ticked(e) {
        bubbles.attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
      }

      simulation.nodes(onlyPlayers.sort())
        .on('tick', ticked);

      bubbles
        .call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended));

      function dragsubject() {
        return simulation.find(d3.event.x, d3.event.y);
      }

      function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      }

      function dragged(d) {
        if (d3.event.x > 820) {
          d.fx = 820;
        } else if (d3.event.x < 0) {
          d.fx = 0;
        } else {
          d.fx = d3.event.x;
        }

        if (d3.event.y > 643) {
          d.fy = 643;
        } else if (d3.event.y < 0) {
          d.fy = 0;
        } else {
          d.fy = d3.event.y;
        }
      }

      function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3);
        d3.event.subject.fx = null;
        d3.event.subject.fy = null;
      }
  }
