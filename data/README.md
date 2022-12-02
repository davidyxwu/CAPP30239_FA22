# Final Project Data: Analyzing the success of the Colorado Avalanche in the 2021-2022 NHL Season (Stanley Cup Winners)

## Overview
This folder contains all data for my final visualization project. 
I am interested in analyzing the Stanley Cup Winner Colorado Avalanche's stats in the 2021-2022 season to understand how good they were in the regular season compared to the rest of the league.

## Raw Files
I am collecting two types of data
1) Overall season data sourced from [Money Puck](https://moneypuck.com/data.htm)
2) Game by game statistics to understand seasonal trends sourced from the [NHL Stats API](https://gitlab.com/dword4/nhlapi/-/tree/master/)

## Cleaning method
I used Python to clean my data and have 5 datasets that I will use to create visualizations.

## Overall team stats regarding goals 
This data is found in [team_stats_goals.csv](team_stats_goals.csv). 
Sourced from Money Puck, this data contains all seasonal stats related to goals scored for every team. 
With this, we can see how effective on offense the Avalanche were compared to other teams. 

## Overall team stats regarding shots 
This data is found in [team_stats_shots.csv](team_stats_shots.csv). 
Sourced from Money Puck, this data contains all seasonal stats related to shots for every team. 
With this, we can see how efficient on offense the Avalanche were shot wise compared to other teams. 

## Overall team stats regarding puck safety
This data is found in [team_stats_turnovers.csv](team_stats_turnovers.csv).
Sourced from Money Puck, this data contains all seasonal stats regarding puck safety stats for every team.
With this, we can see how many takeaways/giveaways the Avalanche committed to compare how well they protect the puck

## Game by game cummulative stats
This data is found in [team_games_cummulative_stats.csv](team_games_cummulative_stats.csv).
Sourced from the NHL stats API, this data cummulates data such as goals, wins, and shots to see compare the seasonal trends (cummulative).

## Game by game individual stats
This data is found in [team_games_indiv_stats.csv](team_games_indiv_stats.csv).
Sourced from the NHL stats API, this data contains the scores of every Avalanche game and the game result. 

## Avalanche Shot map coordinate data
This data is found in [team_shot_map.csv](team_shot_map.csv).
Sourced from the NHL stats API, this data contains the coordinates of every shot and the result.

## Avalanche shot/goal danger analysis
This data is found in [danger_stats.csv](danger_stats.csv). 
Sourced from Moneypuck, this data contains all data on shot/goal danger statistics.

