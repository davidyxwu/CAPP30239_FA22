// Scatterplot
d3.csv("../data/team_stats_turnovers.csv").then((data) => {
    function color(d) {
        return d.team == "COL" ? "red" : "blue";
    }
    let height = 400,
        width = 800,
        margin = { top: 15, right: 50, bottom: 40, left: 50 };
    for (let d of data) {
        d.takeawaysFor = parseInt(d.takeawaysFor);
        d.giveawaysFor = parseInt(d.giveawaysFor);
    }

    const svg = d3
        .select("#turnoversScatter")
        .append("svg")
        .attr("viewBox", [0, 0, width, height]);

    let x = d3
        .scaleLinear()
        .domain(d3.extent(data, (d) => d.giveawaysFor))
        .nice()
        .range([margin.left, width - margin.right]);

    let y = d3
        .scaleLinear()
        .domain(d3.extent(data, (d) => d.takeawaysFor))
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
        .attr("cx", (d) => x(d.giveawaysFor))
        .attr("cy", (d) => y(d.takeawaysFor))
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
        .text("Giveaways");

    svg.append("text")
        .attr("class", "y-label")
        .attr("text-anchor", "end")
        .attr("x", -margin.left)
        .attr("y", 15)
        .attr("transform", "rotate(-90)")
        .text("Takeaways");

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

    d3.selectAll("circle")
        .on("mouseover", function (event, d) {
            d3.select(this).attr("fill", "red");
            tooltip
                .style("visibility", "visible")
                .html(
                    `Team: ${d.team}<br />Giveaways: ${d.giveawaysFor}<br />Takeaways: ${d.takeawaysFor}`
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
    var colorLegend = Legend(
        d3.scaleOrdinal(["Colorado Avalanche", "Other Teams"], ["red", "blue"]),
        { title: "Teams", tickSize: 0, width: 500 }
    );
    d3.select("#turnoversScatter").node().appendChild(colorLegend);
});

// Boxplot
d3.csv("../data/team_stats_turnovers.csv").then((data) => {
    function color(d) {
        if (d.type == "COL") return "red";
        else if (d.type == "Median") return "olive";
        else if (d.type == "Min" || d.type == "Max") return "maroon";
        return "teal";
    }
    let height = 150,
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
        .bandwidth(50)
        .jitter(true)
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
        .selectAll("ellipse")
        .data(plotStats)
        .join("ellipse")
        .attr("cx", (d) => x(d.value))
        .attr("cy", 0)
        .attr("rx", 3)
        .attr("ry", 3)
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .attr("opacity", 1)
        .style("fill", (d) => color(d));
    var points = svg.selectAll("g.ellipse").data(data).enter().append("g");
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
