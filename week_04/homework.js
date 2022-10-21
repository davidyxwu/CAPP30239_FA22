// UI/UX parameters
let height = 500,
    width = 800,
    margin = { top: 25, right: 30, bottom: 35, left: 30 };
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
        .domain(d3.extent(data, (d) => d.Num))
        .range([height - margin.bottom, margin.top]);

    svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x));

    svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(
            d3
                .axisLeft(y)
                .tickSize(-innerWidth)
                .tickFormat((d) => d + "%")
        );

    // Drawing the line
    let line = d3
        .line()
        .x((d) => x(d.Month))
        .y((d) => y(d.Num));

    let g = svg.append("g");

    g.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("d", line);
});
