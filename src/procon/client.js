const io = require('socket.io-client');

const gpio = require('rpi-gpio');

let controll = {};

let counter = 0;

async function init(){

    gpio.setup(8, gpio.DIR_OUT)
    gpio.setup(11, gpio.DIR_OUT)
    gpio.setup(12, gpio.DIR_OUT)
    gpio.setup(15, gpio.DIR_OUT)
    gpio.setup(16, gpio.DIR_OUT)
    return
}

async function outGPIO(pitch, yaw, hover, on, counter){
    if(on){
        console.log('hover')
        gpio.write(8, hover);
    } else {
        console.log('down')
        gpio.write(8, false);
    }
}

(async () => {
    await init();

    socket = io.connect('http://192.168.100.19:3000');
    socket.on('connect', () => {
        console.log('connected!');
        setTimeout(() => {
            socket.emit('get');
        }, 1000);
    });

    socket.on('controll', (data) => {
        controll = JSON.parse(data);
        console.log(data);
        socket.emit('get');
        counter = counter + 1 % 10;
        outGPIO(controll.pitch, controll.yaw, controll.hoverFlag, controll.onFlag, counter);
    });
})();