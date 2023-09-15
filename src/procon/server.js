const { resolve } = require('path');
const { PythonShell } = require('python-shell');

const io = require('socket.io')(3000);
io.on('connection', (socket) => {
    console.log(socket.id);
    socket.on('get', () => {
        console.log('get');
        console.log('battery', battery);
        socket.emit('controll', JSON.stringify(joycon))
    })
});

const pyshell = new PythonShell('./test.py');

let joycon = {yaw:0, pitch:0, hoverFlag:false, onFlag:false}
let battery = 0;

pyshell.send();

let oldHome = false;
let oldOn = false;
let hoverFlag = false;
let onFlag = false;
pyshell.on('message', function (message) {
    const json = JSON.parse(message.replace(/\'/g, '"'))
    // console.log(joycon.accel);
    battery = json.battery.level
    let yaw = (json.accel.x / 5000);
    let pitch = (json.accel.y / 5000);
    let home = json.buttons.left.down == 1;
    let on = (json.buttons.left.sr == 1) && (json.buttons.left.sl == 1);

    if((oldHome === false) && home){
        hoverFlag = !hoverFlag;
        console.log('pushed')
    }

    if((oldOn === false) && on){
        onFlag = !onFlag;
    }

    oldHome = home;
    oldOn = on;

    joycon = {yaw, pitch, hoverFlag, onFlag};
    // console.log(pitch);
});