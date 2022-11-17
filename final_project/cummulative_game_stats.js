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

    for (let team of ["COL", "League"]) {
        let color = team == "COL" ? "red" : "blue";
        let teamData = data.filter((d) => d.Team === team);

        let g = svg.append("g").attr("class", "team");

        g.append("path")
            .datum(teamData)
            .attr("fill", "None")
            .attr("stroke", color)
            .attr("d", line);

        let lastEntry = teamData[teamData.length - 18]; //last piece of data to position text x and y
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
    d3.select(div_id).node().appendChild(colorLegend);
}

d3.csv("../data/team_games_cummulative_stats.csv").then((data) => {
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
    multiline(win_data, "#winsLine", "Wins");
    multiline(shots_data, "#shotsLine", "Shots");
    multiline(goals_data, "#goalsLine", "Goals");
});
