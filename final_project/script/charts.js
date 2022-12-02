/*
This file includes code for all charts used for the article
*/

// Boxplot From Alan Kang https://github.com/akngs/d3-boxplot
const boxplotSymbolDot = "dot";
const boxplotSymbolTick = "tick";

function boxplot() {
    // Context for boxplot
    let vertical = false;
    let scale = d3.scaleLinear();
    let bandwidth = 20;
    let boxwidth = 20;
    let showInnerDots = true;
    let symbol = boxplotSymbolDot;
    let opacity = 0.8;
    let jitter = 0.2;
    let key = undefined;

    function boxplot(ctx) {
        const x = vertical ? "y" : "x";
        const y = vertical ? "x" : "y";
        const h = vertical ? "width" : "height";
        const coor = vertical ? (x, y) => [y, x] : (x, y) => [x, y];
        const inversed = scale.range()[0] > scale.range()[1];

        const renderers = {};
        renderers[boxplotSymbolDot] = {
            nodeName: "circle",
            enter: function (ctx) {
                ctx.attr("fill", "currentColor")
                    .attr("stroke", "none")
                    .attr("opacity", 0)
                    .attr("r", 0)
                    .attr(`c${x}`, (d) => scale(d.value))
                    .attr(`c${y}`, jitterer);
            },
            update: function (ctx) {
                ctx.attr("opacity", opacity)
                    .attr("r", (d) => (d.farout ? r * 1.5 : r))
                    .attr(`c${x}`, (d) => scale(d.value))
                    .attr(`c${y}`, jitterer);
            },
            exit: function (context) {
                context.attr("opacity", 0).attr("r", 0);
            },
        };
        renderers[boxplotSymbolTick] = {
            nodeName: "line",
            enter: function (ctx) {
                ctx.attr("stroke", "currentColor")
                    .attr("opacity", 0)
                    .attr(`${x}1`, (d) => scale(d.value))
                    .attr(`${x}2`, (d) => scale(d.value))
                    .attr(`${y}1`, 0)
                    .attr(`${y}2`, 0);
            },
            update: function (ctx) {
                ctx.attr("opacity", opacity)
                    .attr(`${x}1`, (d) => scale(d.value))
                    .attr(`${x}2`, (d) => scale(d.value))
                    .attr(`${y}1`, Math.min(-2, boxwidth * -0.25))
                    .attr(`${y}2`, Math.max(2, boxwidth * 0.25));
            },
            exit: function (ctx) {
                ctx.attr("opacity", 0).attr(`${y}1`, 0).attr(`${y}2`, 0);
            },
        };
        const renderer = renderers[symbol];

        const selection = ctx.selection ? ctx.selection() : ctx;
        const whiskerPath = (d) =>
            `M${coor(scale(d.start), -0.5 * boxwidth)} l${coor(0, boxwidth)} ` +
            `m${coor(0, -0.5 * boxwidth)} L${coor(scale(d.end), 0)}`;
        const jitterer =
            jitter === 0
                ? 0
                : (d, i) =>
                      // 1. determinisic pseudo random noise
                      Math.sin(1e5 * (i + d.value)) *
                      0.5 *
                      // 2. scale
                      (d.farout ? 0 : d.outlier ? 0.5 : 1) *
                      jitter *
                      bandwidth;
        const r = Math.max(1.5, Math.sqrt(bandwidth) * 0.5);

        let gWhisker = selection.select("g.whisker");
        if (gWhisker.empty())
            gWhisker = selection
                .append("g")
                .attr("class", "whisker")
                .attr("transform", `translate(${coor(0, bandwidth * 0.5)})`);

        let gBox = selection.select("g.box");
        if (gBox.empty())
            gBox = selection
                .append("g")
                .attr("class", "box")
                .attr("transform", `translate(${coor(0, bandwidth * 0.5)})`);

        let gPoint = selection.select("g.point");
        if (gPoint.empty())
            gPoint = selection
                .append("g")
                .attr("class", "point")
                .attr("transform", `translate(${coor(0, bandwidth * 0.5)})`);

        let whisker = gWhisker.selectAll("path").data((d) => d.whiskers);
        whisker = whisker
            .enter()
            .append("path")
            .attr("fill", "none")
            .attr("stroke", "currentColor")
            .attr("opacity", 0)
            .attr("d", whiskerPath)
            .merge(whisker);

        let box = gBox.selectAll("line").data((d) => d.boxes);
        box = box
            .enter()
            .append("line")
            .attr("stroke", "currentColor")
            .attr("stroke-width", boxwidth)
            .attr("opacity", 0)
            .attr(
                `${x}1`,
                (d, i) =>
                    scale(d.start) + (i === 0 ? 0 : 0.5) * (inversed ? -1 : +1)
            )
            .attr(
                `${x}2`,
                (d, i) =>
                    scale(d.end) - (i === 0 ? 0.5 : 0) * (inversed ? -1 : +1)
            )
            .attr(`${y}1`, 0)
            .attr(`${y}2`, 0)
            .attr(h, boxwidth)
            .merge(box);

        // Remove old symbols
        gPoint
            .selectAll(".point")
            .filter(function () {
                return this.nodeName !== renderer.nodeName;
            })
            .remove();

        let point = gPoint
            .selectAll(".point")
            .data(
                (d) =>
                    showInnerDots
                        ? d.points
                        : d.points.filter((d2) => d2.outlier),
                key ? (d) => key(d.datum) : undefined
            );
        let pointExit = point.exit();
        point = point
            .enter()
            .append(renderer.nodeName)
            .attr("class", "point")
            .call(renderer.enter)
            .merge(point)
            .classed("outlier", (d) => d.outlier)
            .classed("farout", (d) => d.farout);

        if (ctx !== selection) {
            gWhisker = gWhisker.transition(ctx);
            gBox = gBox.transition(ctx);
            gPoint = gPoint.transition(ctx);
            whisker = whisker.transition(ctx);
            box = box.transition(ctx);
            point = point.transition(ctx);
            pointExit = pointExit.transition(ctx);
        }

        gWhisker.attr("transform", `translate(${coor(0, bandwidth * 0.5)})`);
        gBox.attr("transform", `translate(${coor(0, bandwidth * 0.5)})`);
        gPoint.attr("transform", `translate(${coor(0, bandwidth * 0.5)})`);
        whisker.attr("opacity", opacity).attr("d", whiskerPath);
        box.attr("opacity", opacity)
            .attr("stroke-width", boxwidth)
            .attr(
                `${x}1`,
                (d, i) =>
                    scale(d.start) + (i === 0 ? 0 : 0.5) * (inversed ? -1 : +1)
            )
            .attr(
                `${x}2`,
                (d, i) =>
                    scale(d.end) - (i === 0 ? 0.5 : 0) * (inversed ? -1 : +1)
            )
            .attr(`${y}1`, 0)
            .attr(`${y}2`, 0);
        point.call(renderer.update);
        pointExit.call(renderer.exit).remove();

        return this;
    }

    boxplot.vertical = (..._) =>
        _.length ? ((vertical = _[0]), boxplot) : vertical;
    boxplot.scale = (..._) => (_.length ? ((scale = _[0]), boxplot) : scale);
    boxplot.showInnerDots = (..._) =>
        _.length ? ((showInnerDots = _[0]), boxplot) : showInnerDots;
    boxplot.bandwidth = (..._) =>
        _.length ? ((bandwidth = _[0]), boxplot) : bandwidth;
    boxplot.boxwidth = (..._) =>
        _.length ? ((boxwidth = _[0]), boxplot) : boxwidth;
    boxplot.symbol = (..._) => (_.length ? ((symbol = _[0]), boxplot) : symbol);
    boxplot.opacity = (..._) =>
        _.length ? ((opacity = _[0]), boxplot) : opacity;
    boxplot.jitter = (..._) => (_.length ? ((jitter = _[0]), boxplot) : jitter);
    boxplot.key = (..._) => (_.length ? ((key = _[0]), boxplot) : key);

    return boxplot;
}

// Calculate statistics of a dataset for the boxplot
function boxplotStats(data, valueof) {
    const values = valueof ? data.map(valueof) : data;
    const fiveNums = [0.0, 0.25, 0.5, 0.75, 1.0].map((d) =>
        d3.quantile(values, d)
    );
    const iqr = fiveNums[3] - fiveNums[1];
    const step = iqr * 1.5;
    const fences = [
        { start: fiveNums[1] - step - step, end: fiveNums[1] - step },
        { start: fiveNums[1] - step, end: fiveNums[1] },
        { start: fiveNums[1], end: fiveNums[3] },
        { start: fiveNums[3], end: fiveNums[3] + step },
        { start: fiveNums[3] + step, end: fiveNums[3] + step + step },
    ];
    const boxes = [
        { start: fiveNums[1], end: fiveNums[2] },
        { start: fiveNums[2], end: fiveNums[3] },
    ];
    const whiskers = [
        {
            start: d3.min(values.filter((d) => fences[1].start <= d)),
            end: fiveNums[1],
        },
        {
            start: d3.max(values.filter((d) => fences[3].end >= d)),
            end: fiveNums[3],
        },
    ];
    const points = values.map((d, i) => ({
        value: d,
        datum: data[i],
        outlier: d < fences[1].start || fences[3].end < d,
        farout: d < fences[0].start || fences[4].end < d,
    }));
    return { fiveNums, iqr, step, fences, boxes, whiskers, points };
}

/* Calendar Chart */
// 82 game calendar chart results for the Avalanche
function calendar(divid) {
    const xDomainCalendar = 18,
        yDomainCalendar = 5;

    // 1d to 2d mapping
    function mapCoordinate(i) {
        y = Math.floor((i - 1) / xDomainCalendar);
        x = (i - 1) % xDomainCalendar;
        return [x, y];
    }

    // Calc goal difference
    function calcGoalDifference(d) {
        return d.away_team == "Colorado Avalanche"
            ? d.away_team_goals - d.home_team_goals
            : d.home_team_goals - d.away_team_goals;
    }

    // Process Data
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
        // Add everything to the div
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
}

// Multiline chart (Avalanche and League)
function multiline(data, div_id, y_label) {
    let height = 500,
        width = 900,
        margin = { top: 25, right: 50, bottom: 35, left: 50 };
    innerWidth = width - margin.left - margin.right;

    const svg = d3
        .select(div_id)
        .append("svg")
        .attr("viewBox", [0, 0, width, height]);

    let x = d3
        .scaleLinear()
        .domain([0, 83])
        .range([margin.left, width - margin.right]);

    let y = d3
        .scaleLinear()
        .domain(d3.extent(data, (d) => d.Value))
        .range([height - margin.bottom, margin.top]);

    svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x))
        .attr("class", "x-axis");

    svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y).tickSize(-innerWidth))
        .attr("class", "y-axis");

    let line = d3
        .line()
        .x((d) => x(d.Game))
        .y((d) => y(d.Value));
    // Graph team and league
    for (let team of ["COL", "League"]) {
        let color = team == "COL" ? "red" : "blue";
        let teamData = data.filter((d) => d.Team === team);

        let g = svg.append("g").attr("class", "team");

        g.append("path")
            .datum(teamData)
            .attr("fill", "None")
            .attr("stroke", color)
            .attr("d", line);
    }
    svg.append("text")
        .attr("class", "x-label")
        .attr("text-anchor", "end")
        .attr("x", width - margin.right)
        .attr("y", height)
        .attr("dx", "0.5em")
        .text("Game");

    svg.append("text")
        .attr("class", "y-label")
        .attr("text-anchor", "end")
        .attr("x", -margin.left)
        .attr("y", 15)
        .attr("transform", "rotate(-90)")
        .text(y_label);
    var colorLegend = Legend(
        d3.scaleOrdinal(["Colorado Avalanche", "League"], ["red", "blue"]),
        { title: "Teams", tickSize: 0, width: 500 }
    );
    // ADD SWATCHES
    var swatchLegend = Swatches(
        d3.scaleOrdinal(["Colorado Avalanche", "League"], ["red", "blue"])
    );
    d3.select(div_id).append("div").node().innerHTML = swatchLegend;
}

// Copyright 2021 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/stacked-horizontal-bar-chart
function StackedBarChart(
    data,
    {
        x = (d) => d, // given d in data, returns the (quantitative) x-value
        y = (d, i) => i, // given d in data, returns the (ordinal) y-value
        z = () => 1, // given d in data, returns the (categorical) z-value
        title, // given d in data, returns the title text
        marginTop = 30, // top margin, in pixels
        marginRight = 0, // right margin, in pixels
        marginBottom = 0, // bottom margin, in pixels
        marginLeft = 40, // left margin, in pixels
        width = 640, // outer width, in pixels
        height, // outer height, in pixels
        xType = d3.scaleLinear, // type of x-scale
        xDomain, // [xmin, xmax]
        xRange = [marginLeft, width - marginRight], // [left, right]
        yDomain, // array of y-values
        yRange, // [bottom, top]
        yPadding = 0.1, // amount of y-range to reserve to separate bars
        zDomain, // array of z-values
        offset = d3.stackOffsetDiverging, // stack offset method
        order = d3.stackOrderNone, // stack order method
        xFormat, // a format specifier string for the x-axis
        xLabel, // a label for the x-axis
        colors = d3.schemeTableau10, // array of colors
    } = {}
) {
    // Compute values.
    const X = d3.map(data, x);
    const Y = d3.map(data, y);
    const Z = d3.map(data, z);

    // Compute default y- and z-domains, and unique them.
    if (yDomain === undefined) yDomain = Y;
    if (zDomain === undefined) zDomain = Z;
    yDomain = new d3.InternSet(yDomain);
    zDomain = new d3.InternSet(zDomain);

    // Omit any data not present in the y- and z-domains.
    const I = d3
        .range(X.length)
        .filter((i) => yDomain.has(Y[i]) && zDomain.has(Z[i]));

    // If the height is not specified, derive it from the y-domain.
    if (height === undefined)
        height = yDomain.size * 25 + marginTop + marginBottom;
    if (yRange === undefined) yRange = [height - marginBottom, marginTop];

    // Compute a nested array of series where each series is [[x1, x2], [x1, x2],
    // [x1, x2], …] representing the x-extent of each stacked rect. In addition,
    // each tuple has an i (index) property so that we can refer back to the
    // original data point (data[i]). This code assumes that there is only one
    // data point for a given unique y- and z-value.
    const series = d3
        .stack()
        .keys(zDomain)
        .value(([, I], z) => X[I.get(z)])
        .order(order)
        .offset(offset)(
            d3.rollup(
                I,
                ([i]) => i,
                (i) => Y[i],
                (i) => Z[i]
            )
        )
        .map((s) =>
            s.map((d) => Object.assign(d, { i: d.data[1].get(s.key) }))
        );

    // Compute the default x-domain. Note: diverging stacks can be negative.
    if (xDomain === undefined) xDomain = d3.extent(series.flat(2));

    // Construct scales, axes, and formats.
    const xScale = xType(xDomain, xRange);
    const yScale = d3.scaleBand(yDomain, yRange).paddingInner(yPadding);
    const color = d3.scaleOrdinal(zDomain, colors);
    const xAxis = d3.axisTop(xScale).ticks(width / 80, xFormat);
    const yAxis = d3.axisLeft(yScale).tickSizeOuter(0);

    // Compute titles.
    if (title === undefined) {
        const formatValue = xScale.tickFormat(100, xFormat);
        title = (i) => `${Y[i]}\n${Z[i]}\n${formatValue(X[i])}`;
    } else {
        const O = d3.map(data, (d) => d);
        const T = title;
        title = (i) => T(O[i], i, data);
    }

    const svg = d3
        .create("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

    svg.append("g")
        .attr("transform", `translate(0,${marginTop})`)
        .call(xAxis)
        .call((g) => g.select(".domain").remove())
        .call((g) =>
            g
                .selectAll(".tick line")
                .clone()
                .attr("y2", height - marginTop - marginBottom)
                .attr("stroke-opacity", 0.1)
        )
        .call((g) =>
            g
                .append("text")
                .attr("x", width - marginRight)
                .attr("y", -22)
                .attr("fill", "currentColor")
                .attr("text-anchor", "end")
                .text(xLabel)
        );

    const bar = svg
        .append("g")
        .selectAll("g")
        .data(series)
        .join("g")
        .attr("fill", ([{ i }]) => color(Z[i]))
        .selectAll("rect")
        .data((d) => d)
        .join("rect")
        .attr("x", ([x1, x2]) => Math.min(xScale(x1), xScale(x2)))
        .attr("y", ({ i }) => yScale(Y[i]))
        .attr("width", ([x1, x2]) => Math.abs(xScale(x1) - xScale(x2)))
        .attr("height", yScale.bandwidth());

    if (title) bar.append("title").text(({ i }) => title(i));

    svg.append("g")
        .attr("transform", `translate(${xScale(0)},0)`)
        .call(yAxis);

    return Object.assign(svg.node(), { scales: { color } });
}

// Rink Heat Map
function heatmap(data, color, legendTitle, divid) {
    const height = 650,
        width = 700,
        margin = { top: 0, right: 50, bottom: 40, left: 20 };
    const svg = d3
        .select(divid)
        .append("svg")
        .attr("viewBox", [0, 0, width, height])
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var colorLegend = Legend(
        d3.scaleSequential([0, 25], ["transparent", color]),
        {
            title: legendTitle,
            width: 500,
        }
    );

    d3.select(divid).node().appendChild(colorLegend);

    // Draw chart (in rink_map.js)
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
    // Hexbin inputs
    var inputForHexbinFun = [];
    data.forEach(function (d) {
        inputForHexbinFun.push([x(d.x), y(d.y)]); // Note that we had the transform value of X and Y !
    });

    // Prepare a color palette
    var colorPalette = d3
        .scaleLinear()
        .domain([0, 25]) // Number of points in the bin?
        .range(["transparent", color]);

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
            return colorPalette(d.length);
        })
        .attr("stroke", "black")
        .attr("stroke-width", "0.1");
}
