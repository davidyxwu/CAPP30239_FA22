## Final Project: Colorado Avalanche 2021-2022 Regular Season Offense Analysis :ice_hockey:

<img src="https://github.com/davidyxwu/CAPP30239_FA22/blob/main/final_project/media/avalanche.jpg" alt="Colorado Avalanche Stanley Cup" width=30% height=30%>

### Overview
For my final project, I chose to analyze hockey statistics because I have always been interested in sports statistics. 
However, as I am far less familiar with hockey compared to other sports, I took this opportunity to gain a better understanding of hockey analytics. 

### Data
I collected data from two sources:
1) Overall season data sourced from [Money Puck](https://moneypuck.com/data.htm)
2) Game by game statistics sourced from the [NHL Stats API](https://gitlab.com/dword4/nhlapi/-/tree/master/)

A description of all data and how I processed them can be found at [this link](https://github.com/davidyxwu/CAPP30239_FA22/tree/main/data).

### Link
Check out my project [here](https://davidyxwu.github.io/CAPP30239_FA22/final_project/) :ice_hockey:!

### Scripts
This directory includes links to all Javascript files. All code is written in Javascript using the d3 library. 

`charts.js`: Template code for all charts used in the article using d3. 
`colorlegend.js`: Template code for color legend and swatches using d3. 
`main.js`: Drawing and styling all charts onto the article.
`rink_map.js`: Drawing a hockey rink using d3. 

### Style 
This directory includes stylesheets for the article, rink, and charts. 

### Media
Picture and logo of the Colorado Avalanche taken from the National Hockey League (NHL).

### Acknowledgements
Special thanks to these links and resources for template code, data, and context on the NHL:
  <li>
      Overall season trend data from
      <a href="https://moneypuck.com/data.htm" target="_blank" rel="noopener noreferrer">Money
          Puck</a>. Raw data file can be found <a
          href="https://github.com/davidyxwu/CAPP30239_FA22/blob/main/data/team_stats_goals.csv"
          target="_blank">here</a>
  </li>
    
  <li>Boxplot code sourced from <a href="https://github.com/akngs/d3-boxplot" target="_blank"
        rel="noopener noreferrer">Alan Kang</a></li>

  <li>Color legend code sourced from <a href="https://observablehq.com/@d3/color-legend"
          target="_blank" rel="noopener noreferrer">Mike Bostock</a>
  </li>

  <li>Stacked bar chart code sourced from <a
          href="https://observablehq.com/@d3/stacked-horizontal-bar-chart" target="_blank"
          rel="noopener noreferrer">Mike Bostock</a>
  </li>

  <li>Rink outline from <a href="https://github.com/war-on-ice/icerink" target="_blank"
          rel="noopener noreferrer">Github</a></li>

  <li>Goal and Shot danger from <a href="https://www.moneypuck.com/glossary.htm" target="_blank"
          rel="noopener noreferrer">Moneypuck</a></li>

  <li>Research on quantifying shot danger location from <a
          href="https://www.nhl.com/kraken/news/seattle-kraken-analytics-with-alison-high-danger-chances/c-328378484"
          target="_blank"> Alison Lukan </a></li>

  <li>Colorado Avalanche 2021-2022 <a
          href="https://primetimesportstalk.com/2022/07/01/colorado-avalanche-2021-22-season-recap/"
          target="_blank">Season
          Recap</a></li>

  <li><a href="https://www.statmuse.com/nhl/ask/average-winning-margin-for-the-colorado-avalanche"
          target="_blank">Stat Muse</a> and 
          <a href=" https://www.hockey-reference.com/teams/COL/2022.html" target="_blank">Hockey Reference</a> for NHL statistics</li>
  <li>
      All photos from the NHL
  </li>
  <li>
      A description of all data can be found <a
          href="https://github.com/davidyxwu/CAPP30239_FA22/tree/main/data" target="_blank">here</a>
  </li>
  
  <li>
    Game by game season data from the official
    <a href="https://gitlab.com/dword4/nhlapi/-/tree/master/" target="_blank"
        rel="noopener noreferrer">NHL
        Stats API</a>. Raw data on individual team stats can be found <a
        href="https://github.com/davidyxwu/CAPP30239_FA22/blob/main/data/raw_data/individual_games_stats.json"
        target="_blank">here</a>
</li>

