const io = require('socket.io-client');

const gpio = require('rpi-gpio');

let controll = {};

let counter = 0;

async function init(){

    gpio.setup(3, gpio.DIR_OUT)
    gpio.setup(11, gpio.DIR_OUT)
    gpio.setup(12, gpio.DIR_OUT)
    gpio.setup(15, gpio.DIR_OUT)
    gpio.setup(16, gpio.DIR_OUT)
    return
}

function clanp(x){
    if (x > 1){
        return 1;
    }

    if(x < -1){
        return -1;
    }

    return x;
}

async function outGPIO(pitch, yaw, hover, on, counter){
    if(on){
        console.log('hover')
        gpio.write(3, hover);

        const right = clanp(pitch * 0.7 + yaw * (-0.7));
        const left = clanp(pitch * 0.7 + yaw * (0.7));
        console.log(counter, parseInt(right * 10), parseInt(left * 10))

        if (-0.2 < parseInt(right * 10) < 0.2){
            gpio.write(12, false);
            gpio.write(12, false);
        }else if (parseInt(right * 10) > counter) {
            gpio.write(11, true);
            gpio.write(12, false);
            console.log('right on');
        } else if (parseInt(right * (-10)) > counter) {
            gpio.write(11, false);
            gpio.write(12, true);
            console.log('right revarse');
        } else {
            gpio.write(12, false);
            gpio.write(12, false);
            console.log('right off');
        }

        if (-0.2 < parseInt(left * 10) < 0.2) {
            gpio.write(12, false);
            gpio.write(12, false);
        }else if (parseInt(left * 10) > counter) {
            gpio.write(15, true);
            gpio.write(16, false);
            console.log('left on');
        } else if (parseInt(left * (-10)) > counter) {
            gpio.write(15, false);
            gpio.write(16, true);
            console.log('left revarse');
        } else {
            gpio.write(15, false);
            gpio.write(16, false);
            console.log('left off');
        }
    } else {
        console.log('down')
        gpio.write(3, false);
        gpio.write(11, false);
        gpio.write(12, false);
        gpio.write(15, false);
        gpio.write(16, false);
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
        counter = (counter + 1) % 10;
        outGPIO(controll.pitch, controll.yaw, controll.hoverFlag, controll.onFlag, counter);
    });
})();