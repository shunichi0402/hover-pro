const io = require('socket.io-client');

const gpio = require('rpi-gpio');

let controll = {};

let counter = 0;

async function init(){
    await new Promise(() => {
        gpio.setup(8, gpio.DIR_OUT)
        gpio.setup(11, gpio.DIR_OUT)
        gpio.setup(12, gpio.DIR_OUT)
        gpio.setup(15, gpio.DIR_OUT)
        gpio.setup(16, gpio.DIR_OUT)
    })
}

async function outGPIO(pitch, yaw, hover, on, counter){
    if(on){
        gpio.write(8, hover);
    } else {
        gpio.write(8, false);
    }
}

socket = io.connect('http://localhost:3000'); 
socket.on('connect', () => {
    socket.emit('get');
});

socket.on('controll', (data) => {
    controll = JSON.parse(data);
    console.log(data);
    socket.emit('get');
    counter = counter + 1 % 10;
    outGPIO(controll.pitch, controll.yaw, controll.hoverFlag, controll.onFlag, counter);
});