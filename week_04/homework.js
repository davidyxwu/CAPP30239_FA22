// UI/UX parameters
const height = 500,
    width = 800,
    margin = { top: 15, right: 30, bottom: 35, left: 40 };
innerWidth = width - margin.left - margin.right;

// Select chart div
const svg = d3
    .select("#chart")
    .append("svg")
    .attr("viewBox", [0, 0, width, height]);

// Process data and build line chart
d3.csv("long-term-interest-canada.csv").then((data) => {
    // Parsing time
    let timeParse = d3.timeParse("%Y-%m");

    // Filter data
    for (let d of data) {
        d.Month = timeParse(d.Month);
        d.Num = +d.Num;
    }

    // Set up axis lines and labels for line chart
    let x = d3
        .scaleTime()
        .domain(d3.extent(data, (d) => d.Month))
        .range([margin.left, width - margin.right]);

    let y = d3
        .scaleLinear()
        .domain([0, d3.max(data, (d) => d.Num)])
        .nice() // nice to round up axis tick
        .range([height - margin.bottom, margin.top]);

    svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).tickSizeOuter(0));

    svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .attr("class", "y-axis") // adding a class to y-axis for scoping
        .call(
            d3
                .axisLeft(y)
                .tickSizeOuter(0)
                .tickFormat((d) => d + "%") // format to include %
                .tickSize(-width + margin.right + margin.left) // modified to meet at end of axis
        );

    // Labels
    svg.append("text")
        .attr("class", "x-label")
        .attr("text-anchor", "end")
        .attr("x", width - margin.right)
        .attr("y", height)
        .attr("dx", "0.5em")
        .attr("dy", "-0.5em")
        .text("Month");

    svg.append("text")
        .attr("class", "y-label")
        .attr("text-anchor", "end")
        .attr("x", -margin.top / 2)
        .attr("dx", "-0.5em")
        .attr("y", 10)
        .attr("transform", "rotate(-90)")
        .text("Interest rate");

    // Drawing the line
    let line = d3
        .line()
        .x((d) => x(d.Month))
        .y((d) => y(d.Num))
        .curve(d3.curveNatural); // more: https://observablehq.com/@d3/d3-line#cell-244;

    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("d", line);
});
