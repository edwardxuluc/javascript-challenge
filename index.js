const data = require('./sources/champions.json');
const { leapYear } = require('./functions');

// * 1. The championsest countries (Confederation + World Cup or choose one tournament).
// * 2. The most runnerUp countries (Confederation + World Cup or choose one tournament).
// 3. Tournaments without headquarter.
// * 4. Champions Headquarters.
// * 5. All finals solved in penalties.
// * 6. Total goals in each tournament.
// 7. Championships consecutively (Choose one tournament).
// * 8. Runner up countries without championships.
// * 9. All finals solved with more than one match.
// * 10. World cup tournament in leap year.

// 1. The championsest countries
const function_1 = (data, confederation_tournament, number_results) => {
    let championsest = {};

    data['worldCup'].forEach(match => {
        championsest[match.champion] = (championsest[match.champion] || 0) + 1
    });

    if( data[confederation_tournament] ){
        data[confederation_tournament].forEach(match => {
            championsest[match.champion] = (championsest[match.champion] || 0) + 1
        });
    }

    championsest = Object.entries(championsest);

    championsest.sort(function(a, b) {
        return b[1] - a[1];
    });

    championsest.length = number_results || 3;

    return championsest.map(item => item[0]);
};

// 2. the most runnerUp countries (Confederation + World Cup or choose one tournament).
const function_2 = (data, confederation_tournament, number_results) => {
    let championsest = {};

    data['worldCup'].forEach(match => {
        championsest[match.runnerUp] = (championsest[match.runnerUp] || 0) + 1
    });

    if( data[confederation_tournament] ){
        data[confederation_tournament].forEach(match => {
            championsest[match.runnerUp] = (championsest[match.runnerUp] || 0) + 1
        });
    }

    championsest = Object.entries(championsest);

    championsest.sort(function(a, b) {
        return b[1] - a[1];
    });

    championsest.length = number_results || 3;

    return championsest.map(item => item[0]);
};

// 3. Tournaments without headquarter.
const function_3 = (data, tournaments) => {
    let matches_without_headquarter = {};

    tournaments.forEach(tournament => {
        let matches = data[tournament].filter(item => !item.headquarter);
        if( matches.length ){
            matches_without_headquarter[tournament] = matches.map(item => `${item.year} => ${item.champion} vs ${item.runnerUp}`);
        }
    });

    return {
        tournaments_without_headquarter: Object.keys(matches_without_headquarter),
        matches_without_headquarter
    };
}

// 4. Champions Headquarters.
const function_4 = (data, tournaments) => {
    let list_champions = [];
    let list_headquarter = [];
    let list_headquarter_champions = [];

    tournaments.forEach(tournament => {
        data[tournament].reduce((acc, current) => {
            if( acc.indexOf(current.champion) === -1 ){
                acc.push(current.champion);
            }
            return acc;
        }, list_champions);

        data[tournament].reduce((acc, current) => {
            if( acc.indexOf(current.headquarter) === -1 ){
                acc.push(current.headquarter);
            }
            return acc;
        }, list_headquarter);
    });

    list_headquarter_champions = list_headquarter.filter(item => {
        return list_champions.indexOf(item) !== -1 ? true : false;
    });

    return list_headquarter_champions;
};

// 5. All finals solved in penalties.
const function_5 = (data, tournaments) => {
    let finals_solved_in_penalties = 0;

    tournaments.forEach(tournament => {
        data[tournament].forEach(match => {
            if (match.score && (match.score || '').endsWith('P')) {
                finals_solved_in_penalties++;
            }
        });
    });

    return finals_solved_in_penalties;
};

// 6. Total goals in each tournament.
const function_6 = (data, tournaments) => {
    let result = {};

    tournaments.forEach(tournament => {

        let goals_per_tournament = 0;

        data[tournament].forEach(match => {

            // reemplazar la p de penalties y dividir en comas
            let scores = match.score.replace('P', '').split(',');

            scores.forEach(score => {

                // dividir por guiones, eliminar los espacios y parsear los valores
                let goals = score.split('-')
                    .map(item => item.trim())
                    .map(item => isNaN(item) ? 0 : parseInt(item));

                // validar que sean 2 marcadores
                if (goals.length === 2) {
                    goals_per_tournament += goals[0] + goals[1];
                }
            });

        });
        result[tournament] = goals_per_tournament;
    });

    return result;
};

// 8. Runner up countries without championships.
const function_8 = (data, tournaments) => {
    let list_runner_up = [];
    let list_champions = [];
    let list_runner_up_without_champions = [];

    tournaments.forEach(tournament => {
        data[tournament].reduce((acc, current) => {
            if( acc.indexOf(current.champion) === -1 ){
                acc.push(current.champion);
            }
            return acc;
        }, list_champions);

        data[tournament].reduce((acc, current) => {
            if( acc.indexOf(current.runnerUp) === -1 ){
                acc.push(current.runnerUp);
            }
            return acc;
        }, list_runner_up);
    });

    list_runner_up_without_champions = list_runner_up.filter(item => {
        return list_champions.indexOf(item) === -1 ? true : false;
    });

    return list_runner_up_without_champions;
};

// 9. All finals solved with more than one match.
const function_9 = (data, tournaments) => {
    let finals_solved_with_more_than_one_match = 0;

    tournaments.forEach(tournament => {
        finals_solved_with_more_than_one_match += data[tournament].filter(item => item.score.indexOf(',') !== -1).length;
    });

    return finals_solved_with_more_than_one_match;
};

// 10. World cup tournament in leap year.
const function_10 = (data) => {
    let tournament_in_leap_year = [];

    data.worldCup.forEach(item => {
        if (leapYear(item.year)) {
            tournament_in_leap_year.push(item);
        }
    });

    return tournament_in_leap_year;
};

let tournaments = Object.keys(data);

tournaments.forEach(tournament => {
    data[tournament].forEach(match => {
        if( match.champion == 'West Germany' || match.champion == 'East Germany'){
            match.champion = 'Germany'
        }

        if( match.runnerUp == 'West Germany' || match.runnerUp == 'East Germany'){
            match.runnerUp = 'Germany'
        }
    });
});

console.log('------------------------------------------------------------------------------------');
console.log('- The championsest countries (Confederation + World Cup or choose one tournament). -');
console.log(function_1(data, 'concacaf', 3));

console.log('------------------------------------------------------------------------------------');
console.log('- The most runnerUp countries (Confederation + World Cup or choose one tournament). -');
console.log(function_2(data, 'concacaf', 3));

console.log('------------------------------------------------------------------------------------');
console.log('- Champions Headquarters. -');
console.log(function_3(data, tournaments));

console.log('------------------------------------------------------------------------------------');
console.log('- Champions Headquarters. -');
console.log(function_4(data, tournaments));

console.log('------------------------------------------------------------------------------------');
console.log('- All finals solved in penalties. -');
console.log(function_5(data, tournaments));

console.log('------------------------------------------------------------------------------------');
console.log('- Total goals in each tournament. -');
console.log(function_6(data, tournaments));

console.log('------------------------------------------------------------------------------------');
console.log('- Runner up countries without championships -');
console.log(function_8(data, tournaments));

console.log('------------------------------------------------------------------------------------');
console.log('- All finals solved with more than one match -');
console.log(function_9(data, tournaments));

console.log('------------------------------------------------------------------------------------');
console.log('- World cup tournament in leap year -');
console.log(function_10(data));