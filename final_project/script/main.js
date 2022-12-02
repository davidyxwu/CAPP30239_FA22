// Game calendar
calendar();

// Multiline
d3.csv("../data/team_games_cummulative_stats.csv").then((data) => {
    // Gather data for formatting
    var win_data = [];
    var shots_data = [];
    var goals_data = [];
    for (let d of data) {
        d.game_num = parseInt(d.game_num);
        win_data.push({
            Team: "COL",
            Game: d.game_num,
            Value: +d.team_wins,
        });

        win_data.push({
            Team: "League",
            Game: d.game_num,
            Value: +d.league_wins,
        });

        shots_data.push({
            Team: "COL",
            Game: d.game_num,
            Value: +d.team_shots,
        });

        shots_data.push({
            Team: "League",
            Game: d.game_num,
            Value: +d.league_shots,
        });

        goals_data.push({
            Team: "COL",
            Game: d.game_num,
            Value: +d.team_goals,
        });

        goals_data.push({
            Team: "League",
            Game: d.game_num,
            Value: +d.league_goals,
        });
    }
    // Draw the lines
    multiline(win_data, "#winsLine", "Wins");
});

// Rink Heatmaps
d3.csv("../data/team_shot_map.csv").then((data) => {
    heatmap(data, "green", "Number of shots", "#shotMap");
    var filteredData = data.filter((d) => d.result == "GOAL");
    heatmap(filteredData, "red", "Number of goals", "#goalsMap");
});

// https://www.clickinsight.ca/blog/building-nhl-shot-maps-with-apps-script-bigquery-and-data-studio
// https://observablehq.com/@mbrownshoes/nhl-shot-and-goal-locations-for-every-goalie?collection=@mbrownshoes/playground

// Goals Boxplot
d3.csv("../data/team_stats_goals.csv").then((data) => {
    function color(d) {
        if (d.type == "COL") return "red";
        else if (d.type == "Median") return "olive";
        else if (d.type == "Min" || d.type == "Max") return "maroon";
        return "teal";
    }
    let height = 200,
        width = 800,
        margin = { top: 10, right: 50, bottom: 50, left: 50 };
    var dataPoints = [];
    const svg = d3
        .select("#goalsBox")
        .append("svg")
        .attr("viewBox", [0, 0, width, height]);
    for (let d of data) {
        d.goalsFor = +d.goalsFor;
        dataPoints.push(+d.goalsFor);
    }
    // Stats
    var stats = boxplotStats(dataPoints);
    var x = d3
        .scaleLinear()
        .domain(d3.extent(dataPoints))
        .range([margin.left, width - margin.right]);
    var plot = boxplot()
        .scale(x)
        .bandwidth(75)
        .jitter(0.3)
        .opacity(0.5)
        .showInnerDots(true);
    svg.datum(stats).attr("color", "mediumpurple").call(plot);

    svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .attr("class", "x-axis")
        .attr("color", "black")
        .call(d3.axisBottom(x));
    // Display all stats in a line below
    var colStats = data.filter((d) => d.team == "COL");
    var plotStats = [
        { type: "COL", value: colStats[0].goalsFor },
        { type: "Min", value: stats.fiveNums[0] },
        { type: "First Quartile", value: stats.fiveNums[1] },
        { type: "Median", value: stats.fiveNums[2] },
        { type: "Third Quartile", value: stats.fiveNums[3] },
        { type: "Max", value: stats.fiveNums[4] },
    ];
    svg.append("g")
        .selectAll("circle")
        .data(plotStats)
        .join("circle")
        .attr("cx", (d) => x(d.value))
        .attr("cy", 0)
        .attr("r", 3)
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .attr("opacity", 1)
        .style("fill", (d) => color(d));
    var points = svg.selectAll("g.circle").data(data).enter().append("g");
    points
        .append("text")
        .data(plotStats)
        .attr("x", (d) => x(d.value))
        .attr("y", height - margin.bottom - 10)
        .attr("text-anchor", "middle")
        .text((d) => d.type)
        .style("font-size", "12px")
        .style("fill", (d) => color(d));
});

// Turnovers Boxplot
d3.csv("../data/team_stats_turnovers.csv").then((data) => {
    function color(d) {
        if (d.type == "COL") return "red";
        else if (d.type == "Median") return "olive";
        else if (d.type == "Min" || d.type == "Max") return "maroon";
        return "teal";
    }
    let height = 200,
        width = 800,
        margin = { top: 10, right: 50, bottom: 50, left: 50 };
    var dataPoints = [];
    const svg = d3
        .select("#turnoversBox")
        .append("svg")
        .attr("viewBox", [0, 0, width, height]);
    for (let d of data) {
        d.giveawaysFor = +d.giveawaysFor;
        dataPoints.push(+d.giveawaysFor);
    }
    var stats = boxplotStats(dataPoints);
    var x = d3
        .scaleLinear()
        .domain(d3.extent(dataPoints))
        .range([margin.left, width - margin.right]);
    var plot = boxplot()
        .scale(x)
        .bandwidth(75)
        .jitter(0.3)
        .opacity(0.5)
        .showInnerDots(true);
    svg.datum(stats).attr("color", "mediumpurple").call(plot);

    svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .attr("class", "x-axis")
        .attr("color", "black")
        .call(d3.axisBottom(x));

    var colStats = data.filter((d) => d.team == "COL");
    var plotStats = [
        { type: "COL", value: colStats[0].giveawaysFor },
        { type: "Min", value: stats.fiveNums[0] },
        { type: "First Quartile", value: stats.fiveNums[1] },
        { type: "Median", value: stats.fiveNums[2] },
        { type: "Third Quartile", value: stats.fiveNums[3] },
        { type: "Max", value: stats.fiveNums[4] },
    ];
    svg.append("g")
        .selectAll("circle")
        .data(plotStats)
        .join("circle")
        .attr("cx", (d) => x(d.value))
        .attr("cy", 0)
        .attr("r", 3)
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .attr("opacity", 1)
        .style("fill", (d) => color(d));
    var points = svg.selectAll("g.circle").data(data).enter().append("g");
    points
        .append("text")
        .data(plotStats)
        .attr("x", (d) => x(d.value))
        .attr("y", height - margin.bottom - 10)
        .attr("text-anchor", "middle")
        .text((d) => d.type)
        .style("font-size", "12px")
        .style("fill", (d) => color(d));
});

// Shots On Goal stacked bar chart
d3.csv("../data/team_stats_shots.csv").then((data) => {
    const width = 900;
    const shots_for_zDomain = [
        "shotsOnGoalFor",
        "missedShotsFor",
        "blockedShotAttemptsFor",
    ];

    var shotsFor = shots_for_zDomain.flatMap((category) =>
        data.map((d) => ({
            team: d.team,
            category,
            total: parseInt(d[category]),
        }))
    );

    var shotsForChart = StackedBarChart(shotsFor, {
        x: (d) => d.total,
        y: (d) => d.team,
        z: (d) => d.category,
        xLabel: "Total Shots Forced",
        yDomain: d3.groupSort(
            shotsFor,
            (D) => d3.sum(D, (d) => d.total),
            (d) => d.team
        ),
        zDomain: shots_for_zDomain,
        colors: d3.schemeCategory10,
        width,
    });
    var shotsForLegend = Legend(
        d3.scaleOrdinal(shots_for_zDomain, d3.schemeCategory10),
        { title: "Shot type", tickSize: 0, width: 500 }
    );
    d3.select("#shotsfor").node().appendChild(shotsForLegend);
    d3.select("#shotsfor").node().appendChild(shotsForChart);
});

// Scatterplot for shot danger
// https://www.reddit.com/r/hockey/comments/skrxfk/high_danger_shots_and_goals_per_team/
d3.csv("../data/danger_stats.csv").then((data) => {
    function color(d) {
        return d.team == "COL" ? "red" : "blue";
    }
    let height = 400,
        width = 800,
        margin = { top: 15, right: 50, bottom: 40, left: 50 };
    for (let d of data) {
        d.highDangerShotsForPerGame = parseInt(d.highDangerShotsFor) / 82;
        d.highDangerGoalsForPerShot =
            parseInt(d.highDangerGoalsFor) / parseInt(d.highDangerShotsFor);
    }
    console.log(data);

    const svg = d3
        .select("#dangerAnalysis")
        .append("svg")
        .attr("viewBox", [0, 0, width, height]);

    let x = d3
        .scaleLinear()
        .domain(d3.extent(data, (d) => d.highDangerShotsForPerGame))
        .nice()
        .range([margin.left, width - margin.right]);

    let y = d3
        .scaleLinear()
        .domain(d3.extent(data, (d) => d.highDangerGoalsForPerShot))
        .nice()
        .range([height - margin.bottom, margin.top]);

    svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .attr("class", "x-axis")
        .call(d3.axisBottom(x).tickSize(-height + margin.top + margin.bottom));

    svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .attr("class", "y-axis")
        .call(d3.axisLeft(y).tickSize(-width + margin.left + margin.right));

    svg.append("g")
        .selectAll("circle")
        .data(data)
        .join("circle")
        .attr("cx", (d) => x(d.highDangerShotsForPerGame))
        .attr("cy", (d) => y(d.highDangerGoalsForPerShot))
        .attr("r", 3)
        .attr("opacity", 0.75)
        .style("fill", (d) => color(d));

    svg.append("text")
        .attr("class", "x-label")
        .attr("text-anchor", "end")
        .attr("x", width - margin.right)
        .attr("y", height)
        .attr("dx", "0.5em")
        .attr("dy", "-0.5em")
        .text("High Danger Shots Per Game");

    svg.append("text")
        .attr("class", "y-label")
        .attr("text-anchor", "end")
        .attr("x", -margin.left)
        .attr("y", 15)
        .attr("transform", "rotate(-90)")
        .text("Goals per High Danger Shot");

    const tooltip = d3
        .select("body")
        .append("div")
        .attr("class", "svg-tooltip")
        .style("position", "absolute")
        .style("visibility", "hidden")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "5px");

    svg.selectAll("circle")
        .on("mouseover", function (event, d) {
            d3.select(this).attr("fill", "red");
            tooltip
                .style("visibility", "visible")
                .html(
                    `Team: ${d.team}<br />High Danger Shots (Total): ${d.highDangerShotsFor}<br />High Danger Shots (Total): ${d.highDangerGoalsFor}`
                );
        })
        .on("mousemove", function (event) {
            tooltip
                .style("top", event.pageY - 10 + "px")
                .style("left", event.pageX + 10 + "px");
        })
        .on("mouseout", function () {
            d3.select(this).attr("fill", "black");
            tooltip.style("visibility", "hidden");
        });
    // ADD SWATCHES
    var swatchLegend = Swatches(
        d3.scaleOrdinal(["Colorado Avalanche", "League"], ["red", "blue"])
    );
    d3.select("#dangerAnalysis").append("div").node().innerHTML = swatchLegend;
});
