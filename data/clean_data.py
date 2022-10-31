import csv
import json
import requests
from collections import defaultdict

url = "https://statsapi.web.nhl.com/api/v1/game/202102{gameNum}/boxscore"
total_games = 1312

# Generic function to filter rows by fields and write it to a new csv
def filter_team_stats(fields, new_file_name):
    rows = []
    with open('raw_data/teams_stats_raw.csv') as csvfile:
        reader = csv.reader(csvfile, delimiter =",")
        header_row  = next(reader)
        for row in reader:
            row_dict = dict(zip(header_row, row))
            if row_dict['situation'] == 'all':
                new_row = []
                for f in fields:
                    new_row.append(row_dict[f])
                rows.append(new_row)
    with open(new_file_name, 'w') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(fields)
        writer.writerows(rows)

# Converts game number to format XXXX for API access
def numToString(num):
    num = str(num)
    while len(num) < 4:
        num = "0" + num
    return num

def write_game_data():
    team_games = defaultdict(dict)
    for i in range(1, total_games + 1):
        print(i)
        try:
            r = requests.get(url.format(gameNum=numToString(i))).json()
        except requests.exceptions.RequestException as e:
            raise SystemExit(e)
        away_team = r['teams']['away']['team']['name']
        home_team = r['teams']['home']['team']['name']
        away_team_stats = r['teams']['away']['teamStats']["teamSkaterStats"]
        home_team_stats = r['teams']['home']['teamStats']["teamSkaterStats"]
        away_win = True if away_team_stats['goals'] > home_team_stats['goals'] else False
        away_team_stats['win'] = away_win
        home_team_stats['win'] = not away_win
        team_games[away_team][len(team_games[away_team]) + 1] = away_team_stats
        team_games[home_team][len(team_games[home_team]) + 1] = home_team_stats
    with open("raw_data/individual_games_stats.json", "w") as outfile:
        json.dump(team_games, outfile)
    outfile.close()

def filter_game_data_cummulative(team):
    fields = ['game_num', 'team', 'team_goals', 'team_wins', 'team_shots', 'league_goals', 'league_wins', 'league_shots']
    rows = []
    team_wins = 0
    team_goals = 0
    team_shots = 0
    league_wins = 0
    league_goals = 0
    league_shots = 0
    with open("raw_data/individual_games_stats.json", "r") as fp:
        game_data = json.load(fp)
        for i in range(1, 83):
            i = str(i)
            for t in game_data:
                if t == team:
                    team_wins += 1 if game_data[t][i]['win'] else 0
                    team_goals += game_data[t][i]['goals']
                    team_shots += game_data[t][i]['shots']
                league_wins += 1 if game_data[t][i]['win'] else 0
                league_goals += game_data[t][i]['goals']
                league_shots += game_data[t][i]['shots']
            rows.append([i, team, team_goals, team_wins, team_shots, round(league_goals / 32, 2), round(league_wins / 32, 2), round(league_shots / 32, 2)])
    with open('team_games_cummulative_stats.csv', 'w') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(fields)
        writer.writerows(rows)

def write_game_data_indiv(team):
    fields = ['game_num', 'team', 'team_result', 'away_team', 'home_team', 'away_team_goals', 'home_team_goals']
    rows = []
    for i in range(1, total_games + 1):
        print(i)
        try:
            r = requests.get(url.format(gameNum=numToString(i))).json()
        except requests.exceptions.RequestException as e:
            raise SystemExit(e)
        away_team = r['teams']['away']['team']['name']
        home_team = r['teams']['home']['team']['name']
        if away_team != team and home_team != team:
            continue
        res = 0
        away_team_stats = r['teams']['away']['teamStats']["teamSkaterStats"]
        home_team_stats = r['teams']['home']['teamStats']["teamSkaterStats"]
        if team == home_team:
            res = 1 if away_team_stats['goals'] < home_team_stats['goals'] else -1
        else:
            res = 1 if away_team_stats['goals'] > home_team_stats['goals'] else -1
        if away_team_stats['goals'] == home_team_stats['goals']:
            res = 0
        rows.append([len(rows) + 1, team, res, away_team, home_team, away_team_stats['goals'], home_team_stats['goals']])
    print(len(rows))
    with open('team_games_indiv_stats.csv', 'w') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(fields)
        writer.writerows(rows)

if __name__ == "__main__":
    """
    filter_team_stats(['team',
                        'shotsOnGoalFor',
                        'missedShotsFor',
                        'blockedShotAttemptsFor',
                        'shotAttemptsFor',
                        'lowDangerShotsFor',
                        'mediumDangerShotsFor',
                        'highDangerShotsFor',
                        'shotsOnGoalAgainst',
                        'missedShotsAgainst',
                        'blockedShotAttemptsAgainst',
                        'shotAttemptsAgainst',
                        'lowDangerShotsAgainst',
                        'mediumDangerShotsAgainst',
                        'highDangerShotsAgainst',
                        ],
                        "team_stats_shots.csv")

    filter_team_stats(['team',
                        'takeawaysFor',
                        'giveawaysFor'],
                        "team_stats_turnovers.csv")

    filter_team_stats(['team',
                        'goalsFor',
                        'lowDangerGoalsFor',
                        'mediumDangerGoalsFor',
                        'highDangerGoalsFor',
                        'goalsAgainst',
                        'lowDangerGoalsAgainst',
                        'mediumDangerGoalsAgainst',
                        'highDangerGoalsAgainst'],
                        "team_stats_goals.csv")


    filter_game_data_cummulative('Colorado Avalanche')
    """
    write_game_data_indiv('Colorado Avalanche')
