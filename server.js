var express = require('express'),
    fs      = require('fs'),
    request = require('request'),
    cheerio = require('cheerio');
var app     = express();

app.get('/scrape', function(req, res){
  var url = 'https://www.msn.com/en-us/sports/nba/phoenix-suns-at-memphis-grizzlies/game-center/sp-id-30401000001674464';

  request(url, function(error, response, html){
    if (error){console.log(error);}
    if(!error){
      var $ = cheerio.load(html);
      /*
      name - 0
      name abreviation - 1
      minutes - 2
      points - 3
      fgm-a - 4
      ftm-a - 5
      3pm-a - 6
      rebounds - 7
      assists - 8
      steals - 9
      blocks - 10
      turnovers - 11
      personalfouls - 12
      */
      var name, nameAbv, min, pts, fgmA, ftmA, threepmA, reb, ast, stl, blk, to, pf;
      var attrs = [name, nameAbv, min, pts, fgmA, ftmA, threepmA, reb, ast, stl, blk, to, pf];
      var keys = ["name", "nameAbv", "min", "pts", "fgmA", "ftmA", "threepmA", "reb", "ast", "stl", "blk", "to", "pf"];
      var players = [];
      var rowlinkLength = $('.rowlink').length;
      for (var j = 0; j < $('.rowlink').length; j++){
        var json = {};
        $('.rowlink').eq(j).filter(function(){
          var data = $(this);
          for (var i = 0; i < data.children().length; i++){
            attrs[i] = data.children().eq(i).text();
            json[keys[i]] = attrs[i];
          }
          players.push(json);
        });
      }
      fs.writeFile('sunsgrizzlies.json', JSON.stringify(players, null, 4), function(err){
      console.log('File successfully written! - Check your project directory for the output.json file');
      });
    }
  });
});

app.listen('8081');
console.log('server is started on port 8081');

exports = module.exports = app;
