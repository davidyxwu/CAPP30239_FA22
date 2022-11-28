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

    const shotsDanger_zDomain = [
        "lowDangerShotsFor",
        "mediumDangerShotsFor",
        "highDangerShotsFor",
    ];

    var shotsDanger = shotsDanger_zDomain.flatMap((category) =>
        data.map((d) => ({
            team: d.team,
            category,
            total:
                (parseInt(d[category]) /
                    (parseInt(d["shotAttemptsFor"]) -
                        parseInt(d["blockedShotAttemptsFor"]))) *
                100,
        }))
    );

    var shotsDangerChart = StackedBarChart(shotsDanger, {
        x: (d) => d.total,
        y: (d) => d.team,
        z: (d) => d.category,
        xLabel: "Shot Danger (%)",
        yDomain: d3.groupSort(
            shotsDanger,
            (D) => d3.sum(D, (d) => d.total),
            (d) => d.team
        ),
        zDomain: shotsDanger_zDomain,
        colors: d3.schemeCategory10,
        width,
    });
    var shotsDangerLegend = Legend(
        d3.scaleOrdinal(shotsDanger_zDomain, d3.schemeCategory10),
        { title: "Shot type", tickSize: 0, width: 500 }
    );

    d3.select("#shotsDanger").node().appendChild(shotsDangerLegend);
    d3.select("#shotsDanger").node().appendChild(shotsDangerChart);
});

d3.csv("../data/team_shot_map.csv").then((data) => {
    const height = 650,
        width = 700,
        margin = { top: 0, right: 50, bottom: 40, left: 20 };
    const svg = d3
        .select("#shotMap")
        .append("svg")
        .attr("viewBox", [0, 0, width, height])
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var colorLegend = Legend(
        d3.scaleSequential([0, 25], ["transparent", "green"]),
        {
            title: "Number of shots",
            width: 500,
        }
    );

    d3.select("#shotMap").node().appendChild(colorLegend);

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
        inputForHexbinFun.push([x(d.x), y(d.y)]); // Note that we had the transform value of X and Y !
    });

    // Prepare a color palette
    var color = d3
        .scaleLinear()
        .domain([0, 25]) // Number of points in the bin?
        .range(["transparent", "green"]);

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
