//exports.ca='huhu';
var okMock = false;

exports.setMock = function () {
    okMock = true;
};

exports.getMock = function () {
    return okMock;
};

var env = '???';
exports.setEnv = function (e) {
    env=e;
};

exports.getEnv = function () {
    return env;
};

exports.setConn = function (k) {
    let cA = myMap.get(k);
    env=k;
    console.log("setConn: " + k);
    if (cA) {
        conn = cA;
        return 'OK ' + "setConn to " + env;
    }
    return 'KO';
};

exports.getConn = function () {
    console.log("getConn: " + env);
    if (!conn) {
        env='ET3';
    };
    conn = myMap.get(env)
    console.log("getConn returns " + env);
    return conn;
};
var conn;
var myMap = new Map();
myMap.set("ET1", {
    "user": "IDMA_SELECT",
    "password": "xxe57qwff32fg346",
    "connectString": "10.171.128.93:51521/etIDMA02.tsystems.com"
});

myMap.set("ET3", {
    "user": "IDMA_SELECT",
    "password": "HappyNewYear2017",
    "connectString": "10.171.128.46:51521/IDMET3AB.tsystems.com"
});

myMap.set("CIT2", {
    "user": "IDMA_SELECT",
    "password": "ykHrYhEhxTN1sxJ90V3W",
    "connectString": "10.163.205.135:51521/cit2IDM2.tsystems.com"
});

myMap.set("CIT4", {
    "user": "IDMA_SELECT",
    "password": "c7dsHJ44FSJf942",
    "connectString": "10.162.169.139:51521/cit4IDM2.world"
});

myMap.set("CTU2", {
    "user": "IDMA_SELECT",
    "password": "???",
    "connectString": "10.162.169.139:51521/cit4IDM2.world"
});