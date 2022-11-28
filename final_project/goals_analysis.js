// https://www.clickinsight.ca/blog/building-nhl-shot-maps-with-apps-script-bigquery-and-data-studio
// https://observablehq.com/@mbrownshoes/nhl-shot-and-goal-locations-for-every-goalie?collection=@mbrownshoes/playground

d3.csv("../data/team_shot_map.csv").then((data) => {
    const height = 650,
        width = 700,
        margin = { top: 0, right: 50, bottom: 40, left: 20 };
    const svg = d3
        .select("#goalsMap")
        .append("svg")
        .attr("viewBox", [0, 0, width, height])
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var colorLegend = Legend(
        d3.scaleSequential([0, 5], ["transparent", "red"]),
        {
            title: "Number of goals",
            width: 500,
        }
    );

    d3.select("#goalsMap").node().appendChild(colorLegend);

    // Draw chart
    var halfHorzPlot = new RINK_MAP({
        parent: svg,
        fullRink: false,
        desiredWidth: 580,
        horizontal: true,
    });

    halfHorzPlot();
    svg.append("g").attr("class", "chart");
    for (d of data) {
        d.x = +d.x;
        d.y = +d.y;
    }

    x = d3
        .scaleLinear()
        .domain([0, 100])
        .range([0, 1364.7058823529412 / 2]);

    y = d3.scaleLinear().domain([-42.5, 42.5]).range([610, 40]);

    var inputForHexbinFun = [];
    data.forEach(function (d) {
        if (d.result == "GOAL") inputForHexbinFun.push([x(d.x), y(d.y)]); // Note that we had the transform value of X and Y !
    });

    // Prepare a color palette
    var color = d3
        .scaleLinear()
        .domain([0, 25]) // Number of points in the bin?
        .range(["transparent", "red"]);

    // Compute the hexbin data
    var hexbin = d3
        .hexbin()
        .radius(9) // size of the bin in px
        .extent([
            [0, 0],
            [width, height],
        ]);

    // Plot the hexbins
    svg.append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", width)
        .attr("height", height);
    svg.append("g")
        .attr("clip-path", "url(#clip)")
        .selectAll("path")
        .data(hexbin(inputForHexbinFun))
        .enter()
        .append("path")
        .attr("d", hexbin.hexagon())
        .attr("transform", function (d) {
            return "translate(" + d.x + "," + d.y + ")";
        })
        .attr("fill", function (d) {
            return color(d.length);
        })
        .attr("stroke", "black")
        .attr("stroke-width", "0.1");
});

// Boxplot
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

d3.csv("../data/team_stats_goals.csv").then((data) => {
    const width = 900;

    const goalsDanger_zDomain = [
        "lowDangerGoalsFor",
        "mediumDangerGoalsFor",
        "highDangerGoalsFor",
    ];

    var goalsDanger = goalsDanger_zDomain.flatMap((category) =>
        data.map((d) => ({
            team: d.team,
            category,
            total: (parseInt(d[category]) / parseInt(d["goalsFor"])) * 100,
        }))
    );

    var goalsDangerChart = StackedBarChart(goalsDanger, {
        x: (d) => d.total,
        y: (d) => d.team,
        z: (d) => d.category,
        xLabel: "Goal Danger (%)",
        yDomain: d3.groupSort(
            goalsDanger,
            (D) => d3.sum(D, (d) => d.total),
            (d) => d.team
        ),
        zDomain: goalsDanger_zDomain,
        colors: d3.schemeCategory10,
        width,
    });
    var goalsDangerLegend = Legend(
        d3.scaleOrdinal(goalsDanger_zDomain, d3.schemeCategory10),
        { title: "Shot type", tickSize: 0, width: 500 }
    );

    d3.select("#goalsDanger").node().appendChild(goalsDangerLegend);
    d3.select("#goalsDanger").node().appendChild(goalsDangerChart);
});
