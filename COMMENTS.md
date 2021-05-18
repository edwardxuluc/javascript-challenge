### function_1  The championsest countries
### function_2  The championsest countries

Don't repeat yourself.

Impure behaviour
```
championsest.length = number_results || 3;
```

Proposal
```
elements = number_results || 3
return [...championsest].splice(0, elements)
```


### function_4 Champions Headquarters (Error)

``` Output
- Champions Headquarters. -
[
  'France',
  'Spain',
  'Italy',
  'Germany',
  'England',
  'Portugal',
  'United States of America',
  'Guatemala',
  'Honduras',
  'Costa Rica',
  'Haiti',
  'Mexico',
  'Brazil',
  'Chile',
  'Argentina',
  'Peru',
  'Colombia',
  'Paraguay',
  'Bolivia',
  'Uruguay'
]
```

Next countries doesn't won a cup as headquarter:

* Portugal
* Guatemala
* Paraguay

```
{ "year": 1965, "headquarter": "Guatemala", "champion": "Mexico", "runnerUp": "Guatemala", "score": "League" }
{ "year": 2004, "headquarter": "Portugal", "champion": "Greek", "runnerUp": "Portugal", "score": "1-0" }
{ "year": 1999, "headquarter": "Paraguay", "champion": "Brazil", "runnerUp": "Uruguay", "score": "3-0" }
```

Unnecessary ternary operator
```
list_champions.indexOf(item) !== -1 ? true : false;
```

Proposal
```
list_champions.indexOf(item) !== -1;
```

### function_5 All finals solved in penalties (Done)

Deep loop
```
tournaments.forEach(tournament => {
        data[tournament].forEach(match => {
            if (match.score && (match.score || '').endsWith('P')) {
                finals_solved_in_penalties++;
            }
        });
    });
```

Proposal to reduce deep loop
```
const matches = [ ...data.uefa, ...data.concacaf, ...data.conmebol, ...data.worldCup ]
matches.filter(match => match.score && (match.score || '').endsWith('P'))
```

### function_6 Total goals in each tournament


``` Twice loop to get goals
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
```

Proposal to get total goals
```
const goals = match.score.replace(/\s/g, '').split(/\D/g).reduce(((sum, curr) => Number(sum) + Number(curr)), 0)
```

### function_8 Runner up countries without championships (Done)

DRY: Don't repeat yourself
```
 data[tournament].reduce((acc, current) => {
    if( acc.indexOf(current.champion) === -1 ){
        acc.push(current.champion);
    }
    return acc;
}, list_champions);
```

### function_9 All finals solved with more than one match.

Deep loop
```
tournaments.forEach(tournament => {
    finals_solved_with_more_than_one_match += data[tournament].filter(item => item.score.indexOf(',') !== -1).length;
});
```

Proposal:
```
const matches = [ ...data.uefa, ...data.concacaf, ...data.conmebol, ...data.worldCup ]
matches.filter(match => match.score.indexOf(',') !== -1).length
```

### function_10 World cup tournament in leap year.

Loop and array instead filter
```
let tournament_in_leap_year = [];
data.worldCup.forEach(item => {
    if (leapYear(item.year)) {
        tournament_in_leap_year.push(item);
    }
});

return tournament_in_leap_year;
```

```
return data.worldCup.filter(cup => leapYear(cup.year))
```

### General comments

* global Block code outside function

```
/**
 * Non function block code 
 * Importance: Middle
 */
tournaments.forEach(tournament => {
    /**
     * Multiple or condition
     * GERMANY.includes(team) where GERMANY = ['West Germany', 'East Germany']
     * Importance: Low
     */
    data[tournament].forEach(match => {
        if( match.champion == 'West Germany' || match.champion == 'East Germany'){
            match.champion = 'Germany'
        }

        if( match.runnerUp == 'West Germany' || match.runnerUp == 'East Germany'){
            match.runnerUp = 'Germany'
        }
    });
});
```

* Functions name doesn't describe funcionallity
* Repeated code
* Unnecessary loops
* Full scope functions instead exported methods
* Single commit 17c40bc92fb22e2980526f7d932b7f09841e6c9e
* Commit created in main branch.