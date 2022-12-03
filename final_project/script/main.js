/*
    This file formats and displays all charts onto the article
*/

// Game calendar
calendar();

// Multiline for wins
d3.csv("../data/team_games_cummulative_stats.csv").then((data) => {
    // Gather data for formatting
    var win_data = [];
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

// Goals Boxplot
d3.csv("../data/team_stats_goals.csv").then((data) => {
    // Filter data for boxplot function
    var dataPoints = [];
    for (let d of data) {
        d.goalsFor = +d.goalsFor;
        dataPoints.push(+d.goalsFor);
    }

    drawBoxPlot(data, dataPoints, "#goalsBox");
});

// Turnovers Boxplot
d3.csv("../data/team_stats_turnovers.csv").then((data) => {
    var dataPoints = [];

    for (let d of data) {
        d.giveawaysFor = +d.giveawaysFor;
        dataPoints.push(+d.giveawaysFor);
    }

    drawBoxPlot(data, dataPoints, "#turnoversBox");
});

// Shots On Goal stacked bar chart
d3.csv("../data/team_stats_shots.csv").then((data) => {
    const width = 900;

    // Filter Data
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

    // Chart
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
d3.csv("../data/danger_stats.csv").then((data) => {
    // Color for scatterplot
    function color(d) {
        return d.team == "COL" ? "red" : "blue";
    }

    let height = 400,
        width = 800,
        margin = { top: 15, right: 50, bottom: 40, left: 50 };

    // Filter Data
    for (let d of data) {
        d.highDangerShotsForPerGame = parseInt(d.highDangerShotsFor) / 82;
        d.highDangerGoalsForPerShot =
            parseInt(d.highDangerGoalsFor) / parseInt(d.highDangerShotsFor);
    }

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

    // Tooltip
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
                    `Team: ${d.team}<br />High Danger Shots (Total): ${d.highDangerShotsFor}<br />High Danger Goals (Total): ${d.highDangerGoalsFor}`
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
    // Swatches Legend
    var swatchLegend = Swatches(
        d3.scaleOrdinal(["Colorado Avalanche", "League"], ["red", "blue"])
    );
    d3.select("#dangerAnalysis").append("div").node().innerHTML = swatchLegend;
});
