const xDomainCalendar = 18,
    yDomainCalendar = 5;

function mapCoordinate(i) {
    y = Math.floor((i - 1) / xDomainCalendar);
    x = (i - 1) % xDomainCalendar;
    return [x, y];
}

function calcGoalDifference(d) {
    return d.away_team == "Colorado Avalanche"
        ? d.away_team_goals - d.home_team_goals
        : d.home_team_goals - d.away_team_goals;
}

d3.csv("../data/team_games_indiv_stats.csv").then((data) => {
    const height = 300,
        width = 800,
        margin = { top: 15, right: 30, bottom: 40, left: 30 };
    innerWidth = width - margin.left - margin.right;
    var maxGoalDifference = 0;
    for (let d of data) {
        d.game_num = Number(d.game_num); //force a number
        d.team_result = Number(d.team_result);
        d.away_team_goals = Number(d.away_team_goals);
        d.home_team_goals = Number(d.home_team_goals);
        maxGoalDifference = Math.max(
            Math.abs(d.home_team_goals - d.away_team_goals),
            maxGoalDifference
        );
    }
    // create a tooltip
    const color = d3
        .scaleSequential(
            [-maxGoalDifference, +maxGoalDifference],
            d3.interpolateRdYlGn
        )
        .unknown("none");

    var colorLegend = Legend(
        d3.scaleSequential(
            [-maxGoalDifference, +maxGoalDifference],
            d3.interpolateRdYlGn
        ),
        {
            title: "Goal Difference",
            width: 500,
        }
    );

    const svg = d3
        .select("#game_calendar")
        .append("svg")
        .attr("viewBox", [0, 0, width, height]);

    const x = d3
        .scaleBand()
        .domain(Array.from(Array(xDomainCalendar).keys()))
        .range([margin.left, width - margin.right])
        .padding(0.1);

    const y = d3
        .scaleBand()
        .domain(Array.from(Array(yDomainCalendar).keys()).reverse())
        .range([height - margin.bottom, margin.top])
        .padding(0.1);

    svg.append("g")
        .selectAll("rect")
        .data(data)
        .join("rect")
        .attr("x", (d) => x(mapCoordinate(d.game_num)[0]))
        .attr("y", (d) => y(mapCoordinate(d.game_num)[1]))
        .attr("width", x.bandwidth())
        .attr("height", y.bandwidth())
        .attr("fill", (d) => color(calcGoalDifference(d)))
        .style("stroke", "black");

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

    d3.selectAll("rect")
        .on("mouseover", function (event, d) {
            tooltip.style("visibility", "visible").html(
                `Game ${d.game_num}<br />
                    ${d.home_team}: ${d.home_team_goals}<br />
                    ${d.away_team}: ${d.away_team_goals}`
            );
        })
        .on("mousemove", function (event) {
            tooltip
                .style("top", event.clientY - 10 + "px")
                .style("left", event.clientX + 10 + "px");
        })
        .on("mouseout", function () {
            tooltip.style("visibility", "hidden");
        });

    d3.select("#game_calendar").node().appendChild(colorLegend);
});
