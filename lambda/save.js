const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const bucket = 'apex-stat-trak';

exports.handler = async (event) => {
    const response = {
        statusCode: 204,
        body: '',
    };

    await saveMatch(event);

    let player = event.pathParameters.player;
    let path = 'players/' + player + '/stats.json';

    try {
        let data = await getRollup(path, event);
        await updateRollup(path, event, data);
    } catch (e) {
        await createRollup(path, event);
    }

    return response;
};

async function saveMatch(event) {
    let match = event.pathParameters.match;
    let player = event.pathParameters.player;
    let data = event.body;
    let path = 'players/' + player + '/matches/' + match + '.json';
    
    return putObjectToS3(path, data);
}

async function getRollup(path, event) {
    let params = {
        Bucket: bucket,
        Key: path
    };

    return s3.getObject(params).promise();
}

async function createRollup(path, event) {
    let data = create();
    let body = JSON.parse(event.body);
    let match = event.pathParameters.match;
    let player = event.pathParameters.player;

    data.legends = {};
    data.legends[body.legend] = create();

    data.weapons = body.weaponStats;

    data.updated = new Date().toISOString();
    
    data.matches = [];
    data.matches.push('/players/' + player + '/matches/' + match + '.json');
    
    accumulate(data, body);
    accumulate(data.legends[body.legend], body);

    return putObjectToS3(path, JSON.stringify(data));
}

async function updateRollup(path, event, data) {
    let body = JSON.parse(event.body);
    let match = event.pathParameters.match;
    let player = event.pathParameters.player;
    
    data = JSON.parse(data.Body.toString());

    if (!data.legends[body.legend]) {
        data.legends[body.legend] = create();
    }

    for(let i in body.weaponStats) {
        if (!data.weapons[i]) {
            data.weapons[i] = body.weaponStats[i];
        } else {
            data.weapons[i].knockdowns += body.weaponStats[i].knockdowns;
            data.weapons[i].kills += body.weaponStats[i].kills;
        }
    }

    data.updated = new Date().toISOString();
    
    data.matches.push('/players/' + player + '/matches/' + match + '.json');

    accumulate(data, body);
    accumulate(data.legends[body.legend], body);

    return putObjectToS3(path, JSON.stringify(data));
}

function accumulate(data, body) {
    data.games++;
    data.knocked_out += body.knocked_out;
    data.deaths += body.deaths;
    data.kills += body.kills;
    data.knockdown += body.knockdown;
    data.wins += ('true' == body.win) ? 1 : 0;
    data.leads += ('true' == body.lead) ? 1 : 0;
}

function create() {
    return {
        games: 0,
        knocked_out: 0,
        deaths: 0,
        kills: 0,
        knockdown: 0,
        wins: 0,
        leads: 0
    };
}

async function putObjectToS3(key, data) {
    let params = {
        Bucket: bucket,
        Key: key,
        Body: data,
        ACL: "public-read",
        ContentType: 'application/json'
    };
    
    return s3.putObject(params).promise();
}