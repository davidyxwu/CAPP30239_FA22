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
