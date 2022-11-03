// Utils functions
function parseData(data) {
    let parseDate = function (date) {
        let timeParse = d3.timeParse("%_m/%_d/%Y");
        let parsedDate = timeParse(date);
        let mm = parsedDate.getMonth() + 1;
        if (mm < 10) mm = "0" + mm;
        let yyyy = parsedDate.getFullYear();
        return yyyy + "-" + mm;
    };
    let newData = {
        gender: {},
        mentalIllness: {},
        race: {},
        age: [],
        month: {},
    };
    for (d of data) {
        if (d.Gender)
            newData.gender[d.Gender] = (newData.gender[d.Gender] || 0) + 1;
        newData.mentalIllness[d.Mental_illness] =
            (newData.mentalIllness[d.Mental_illness] || 0) + 1;
        if (d.Race) newData.race[d.Race] = (newData.race[d.Race] || 0) + 1;
        if (d.Age) newData.age.push({ age: d.Age });
        if (d.Date)
            newData.month[parseDate(d.Date)] =
                (newData.month[parseDate(d.Date)] || 0) + 1;
    }
    return newData;
}

// Line Chart
function countLineChart(data) {
    // Line chart
    const lineHeight = 500,
        lineWidth = 800,
        lineMargin = { top: 15, right: 30, bottom: 40, left: 40 };
    lineInnerWidth = lineWidth - lineMargin.left - lineMargin.right;

    const lineSVG = d3
        .select("#lineChart")
        .append("svg")
        .attr("viewBox", [0, 0, lineWidth, lineHeight]);
    let timeParse = d3.timeParse("%Y-%m");
    let dataPoints = [];
    // Filter data
    for (let d in data) {
        dataPoints.push({ Month: timeParse(d), Num: +data[d] });
    }

    dataPoints.sort(function (a, b) {
        return a.Month - b.Month;
    });
    let x = d3
        .scaleTime()
        .domain(d3.extent(dataPoints, (d) => d.Month))
        .range([lineMargin.left, lineWidth - lineMargin.right]);

    let y = d3
        .scaleLinear()
        .domain([
            d3.min(dataPoints, (d) => d.Num),
            d3.max(dataPoints, (d) => d.Num),
        ])
        .nice() // nice to round up axis tick
        .range([lineHeight - lineMargin.bottom, lineMargin.top]);

    lineSVG
        .append("g")
        .attr("transform", `translate(0,${lineHeight - lineMargin.bottom})`)
        .call(d3.axisBottom(x).tickSizeOuter(0));

    lineSVG
        .append("g")
        .attr("transform", `translate(${lineMargin.left},0)`)
        .attr("class", "y-axis") // adding a class to y-axis for scoping
        .call(
            d3
                .axisLeft(y)
                .tickSizeOuter(0)
                .tickSize(-lineWidth + lineMargin.right + lineMargin.left) // modified to meet at end of axis
        );

    // Labels
    lineSVG
        .append("text")
        .attr("class", "x-label")
        .attr("text-anchor", "end")
        .attr("x", lineWidth - lineMargin.right)
        .attr("y", lineHeight)
        .attr("dx", "0.5em")
        .attr("dy", "-0.5em")
        .text("Month");

    lineSVG
        .append("text")
        .attr("class", "y-label")
        .attr("text-anchor", "end")
        .attr("x", -lineMargin.top / 2)
        .attr("dx", "-0.5em")
        .attr("y", 10)
        .attr("transform", "rotate(-90)")
        .text("Number of Police Killings");

    // Drawing the line
    let line = d3
        .line()
        .x((d) => x(d.Month))
        .y((d) => y(d.Num));

    lineSVG
        .append("path")
        .datum(dataPoints)
        .attr("fill", "none")
        .attr("stroke", "darkred")
        .attr("d", line);
}

// Histogram
function ageHistogram(data) {
    const histogramHeight = 500,
        histogramWidth = 800,
        histogramMargin = { top: 25, right: 10, bottom: 50, left: 10 },
        histogramPadding = 1;

    const histogramSVG = d3
        .select("#histogram")
        .append("svg")
        .attr("viewBox", [0, 0, histogramWidth, histogramHeight]);

    const x = d3
        .scaleLinear()
        .domain(d3.extent(data, (d) => d.age))
        .nice()
        .range([histogramMargin.left, histogramWidth - histogramMargin.right]);

    const y = d3
        .scaleLinear()
        .range([histogramHeight - histogramMargin.bottom, histogramMargin.top])
        .domain([0, 450]);

    histogramSVG
        .append("g")
        .attr(
            "transform",
            `translate(0,${histogramHeight - histogramMargin.bottom + 5})`
        )
        .call(d3.axisBottom(x));

    const binGroups = histogramSVG.append("g").attr("class", "bin-group");
    const bins = d3
        .bin()
        .thresholds(10)
        .value((d) => d.age)(data);

    let g = binGroups.selectAll("g").data(bins).join("g");

    g.append("rect")
        .attr("x", (d) => x(d.x0) + histogramPadding / 2)
        .attr("width", (d) => x(d.x1) - x(d.x0) - histogramPadding)
        .attr("y", histogramHeight - histogramMargin.bottom)
        .attr("height", 0)
        .attr("fill", "darkred")
        .transition()
        .duration(750)
        .attr("y", (d) => y(d.length))
        .attr(
            "height",
            (d) => histogramHeight - histogramMargin.bottom - y(d.length)
        );

    // Labels
    g.append("text")
        .text((d) => d.length)
        .attr("x", (d) => x(d.x0) + (x(d.x1) - x(d.x0)) / 2)
        .attr("y", (d) => y(d.length) - 5)
        .attr("text-anchor", "middle")
        .attr("fill", "#333");
    histogramSVG
        .append("text")
        .attr("class", "x-label")
        .attr("text-anchor", "end")
        .attr("x", histogramWidth - histogramMargin.right)
        .attr("y", histogramHeight)
        .attr("dx", "0.5em")
        .attr("dy", "-0.5em")
        .text("Age (Years)");
}

// Race bar chart
function raceBar(data) {
    const barMargin = { top: 15, right: 25, bottom: 50, left: 60 };
    const barHeight = 500,
        barWidth = 800;

    const barSVG = d3
        .select("#bar")
        .append("svg")
        .attr("width", barWidth + barMargin.left + barMargin.right)
        .attr("height", barHeight + barMargin.top + barMargin.bottom)
        .append("g")
        .attr(
            "transform",
            "translate(" + barMargin.left + "," + barMargin.top + ")"
        );

    let dataPoints = [];
    // Filter data
    for (let d in data) {
        dataPoints.push({ Race: d, Num: +data[d] });
    }

    dataPoints.sort(function (a, b) {
        return a.Num - b.Num;
    });

    let x = d3
        .scaleLinear()
        .range([barMargin.left, barWidth - barMargin.right])
        .domain([0, d3.max(dataPoints, (d) => d.Num)])
        .nice();

    let y = d3
        .scaleBand()
        .domain(dataPoints.map((d) => d.Race))
        .range([barHeight - barMargin.bottom, barMargin.top])
        .padding(0.1);

    barSVG
        .append("g")
        .attr("transform", `translate(0,${barHeight - barMargin.bottom + 5})`) // move location of axis
        .call(d3.axisBottom(x));

    barSVG
        .append("g")
        .attr("transform", `translate(${barMargin.left - 5},0)`)
        .call(d3.axisLeft(y));

    let bar = barSVG
        .selectAll(".bar") // create bar groups
        .append("g")
        .data(dataPoints)
        .join("g")
        .attr("class", "bar");

    bar.append("rect") // add rect to bar group
        .attr("fill", "darkred")
        .attr("y", (d) => y(d.Race))
        .attr("height", y.bandwidth())
        .attr("x", barMargin.left)
        .attr("width", (d) => x(d.Num) - x(0));

    bar.append("text") // add labels
        .text((d) => d.Num)
        .attr("y", (d) => y(d.Race) + y.bandwidth() / 2)
        .attr("x", (d) => x(d.Num) + 15)
        .attr("text-anchor", "middle")
        .style("fill", "black");

    // Labels
    barSVG
        .append("text")
        .attr("class", "x-label")
        .attr("text-anchor", "end")
        .attr("x", barWidth - barMargin.right)
        .attr("y", barHeight)
        .attr("dx", "0.5em")
        .attr("dy", "-0.5em")
        .text("Number of Killings");

    barSVG
        .append("text")
        .attr("class", "y-label")
        .attr("text-anchor", "end")
        .attr("x", -barMargin.top / 2)
        .attr("dx", "-0.5em")
        .attr("y", 10)
        .attr("transform", "rotate(-90)")
        .text("Race");
}

function drawRing(data, title, svgID) {
    const ringHeight = 500,
        ringWidth = 800,
        innerRadius = 125,
        outerRadius = 175,
        labelRadius = 200;
    let dataPoints = [];
    for (let d in data) {
        dataPoints.push({ category: d, amount: +data[d] });
    }
    const arcs = d3.pie().value((d) => d.amount)(dataPoints);
    const arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius);
    const arcLabel = d3.arc().innerRadius(labelRadius).outerRadius(labelRadius);

    const svg = d3
        .select(svgID)
        .append("svg")
        .attr("width", ringWidth)
        .attr("height", ringHeight)
        .attr("viewBox", [
            -ringWidth / 2,
            -ringHeight / 2,
            ringWidth,
            ringHeight,
        ])
        .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

    svg.append("g")
        .attr("stroke", "white")
        .attr("stroke-width", 2)
        .attr("stroke-linejoin", "round")
        .selectAll("path")
        .data(arcs)
        .join("path")
        .attr("fill", (d, i) => d3.schemeCategory10[i])
        .attr("d", arc);

    svg.append("g")
        .attr("font-size", 10)
        .attr("text-anchor", "middle")
        .selectAll("text")
        .data(arcs)
        .join("text")
        .attr("transform", (d) => `translate(${arcLabel.centroid(d)})`)
        .selectAll("tspan")
        .data((d) => {
            return [d.data.category, d.data.amount];
        })
        .join("tspan")
        .attr("x", 0)
        .attr("y", (d, i) => `${i * 1.1}em`)
        .attr("font-weight", (d, i) => (i ? null : "bold"))
        .text((d) => d);

    svg.append("text")
        .attr("font-size", 30)
        .attr("font-weight", "bold")
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .text(title);
    console.log(dataPoints);
}

// Draw all the charts
d3.json("a3cleanedonly2015.json").then((data) => {
    let newData = parseData(data);
    console.log(newData);
    countLineChart(newData.month);
    ageHistogram(newData.age);
    raceBar(newData.race);
    drawRing(newData.gender, "Gender", "#ringGender");
    drawRing(newData.mentalIllness, "Mental Illness", "#ringMentalIllness");
});
