# Week 2: Finding Data for the Final Project

## Overview
For my final project, I am interested in creating data visualizations about certain statistics about the National Hockey League (NHL) :ice_hockey:. 

## Data Source
I will be using the official NHL stats api and records API that the NHL provides. 
The stats API can be accessed by a GET request using the URL 
`https://statsapi.web.nhl.com/api/v1`
with various endpoints. The records API can be accessed by a GET request using the URL
`https://records.nhl.com/site/api`. The API is well documented [here](https://gitlab.com/dword4/nhlapi/-/tree/master/).

## Description of Data
The NHL API is the source of truth for all stats in the NHL. 
Specifically, one can call the endpoint and look up stats for a player for a specific season. 
The API also allows you to get the gamelog for a specific game, allowing you to analyze various gametime events. 
As linked above, I have included a documentation for specific endpoints for the API. 

## Why am I interested?
I am interested in NHL statistics because I have always been interested in sports. 
However, while other sports such as baseball and basketball are notorious for being analytics heavy, hockey, being a less popular sport, lags behind.
While I am not a hockey player and not too familiar with the sport, I hope this project will let me deep dive into the world of hockey and understand the game better through the lens of analytics. 
 
## Thoughts on how I would hope to use this data
While I am not sure which statistics I will use (there are a ton!), for this project, I think I will focus on individual player statistics.
Using the API endpoint, I can query up a players individual statistics for a season. There are also CSV files from secondary sources that have scraped data from the API and put them in a well formatted file that I can utilize as well. I have listed these secondary sources below. 
From here, I can compare individual player statistics to the league average through a multitude of different types of charts. 

## Potential data points
Here is an example of player Nathan MacKinnon's stats for the 2020-2021 season:
```json
{
  "copyright" : "NHL and the NHL Shield are registered trademarks of the National Hockey League. NHL and NHL team marks are the property of the NHL and its teams. © NHL 2022. All Rights Reserved.",
  "stats" : [ {
    "type" : {
      "displayName" : "statsSingleSeason",
      "gameType" : {
        "id" : "R",
        "description" : "Regular season",
        "postseason" : false
      }
    },
    "splits" : [ {
      "season" : "20202021",
      "stat" : {
        "timeOnIce" : "977:29",
        "assists" : 45,
        "goals" : 20,
        "pim" : 37,
        "shots" : 206,
        "games" : 48,
        "hits" : 38,
        "powerPlayGoals" : 8,
        "powerPlayPoints" : 25,
        "powerPlayTimeOnIce" : "197:13",
        "evenTimeOnIce" : "778:20",
        "penaltyMinutes" : "37",
        "faceOffPct" : 48.47,
        "shotPct" : 9.7,
        "gameWinningGoals" : 2,
        "overTimeGoals" : 0,
        "shortHandedGoals" : 0,
        "shortHandedPoints" : 0,
        "shortHandedTimeOnIce" : "01:56",
        "blocked" : 15,
        "plusMinus" : 22,
        "points" : 65,
        "shifts" : 1092,
        "timeOnIcePerGame" : "20:21",
        "evenTimeOnIcePerGame" : "16:12",
        "shortHandedTimeOnIcePerGame" : "00:02",
        "powerPlayTimeOnIcePerGame" : "04:06"
      }
    } ]
  } ]
}
```
I have also attached a CSV file with player stats in various game situations (5v5, 4v5, etc.) to this folder with additional data points as well. 
From here, one can see a players overall season stats. We can normalize them to a per game basis or a per 30 game basis for different statistics. 

## Concerns about the data

## Other secondary sources
This data is primary, as it comes from the official NHL organization and provides a lot of information from game logs to individual player information. 
Some secondary data I could use include more organized data from sources such as [Money Puck](https://moneypuck.com/data.htm).
