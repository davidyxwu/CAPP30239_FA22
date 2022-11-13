d3.csv("../data/team_stats_shots.csv").then((data) => {
    const width = 950;
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
    console.log(shotsFor);

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

    const shots_against_zDomain = [
        "shotsOnGoalAgainst",
        "missedShotsAgainst",
        "blockedShotAttemptsAgainst",
    ];

    var shotsAgainst = shots_against_zDomain.flatMap((category) =>
        data.map((d) => ({
            team: d.team,
            category,
            total: parseInt(d[category]),
        }))
    );
    console.log(shotsAgainst);

    var shotsAgainstChart = StackedBarChart(shotsAgainst, {
        x: (d) => d.total,
        y: (d) => d.team,
        z: (d) => d.category,
        xLabel: "Total Shots Against",
        yDomain: d3.groupSort(
            shotsAgainst,
            (D) => -d3.sum(D, (d) => d.total),
            (d) => d.team
        ),
        zDomain: shots_against_zDomain,
        colors: d3.schemeCategory10,
        width,
    });
    var shotsAgainstLegend = Legend(
        d3.scaleOrdinal(shots_against_zDomain, d3.schemeCategory10),
        { title: "Shot type", tickSize: 0, width: 500 }
    );

    d3.select("#shotsAgainst").node().appendChild(shotsAgainstLegend);
    d3.select("#shotsAgainst").node().appendChild(shotsAgainstChart);
});
