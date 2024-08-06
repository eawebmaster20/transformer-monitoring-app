const { SerialPort } = require('serialport')
const { DelimiterParser } = require('@serialport/parser-delimiter')
let domCurrentElement = document.getElementById("current")
let domVoltageElement = document.getElementById("voltage")
let domPowerElement = document.getElementById("power")
let domTemperatureElement = document.getElementById("temp")

const test = new SerialPort({ path: '/dev/ttyUSB0', baudRate: 9600 });
const parser = test.pipe(new DelimiterParser({ delimiter: '\n' }))
parser.on('data', (dat)=>{
    if (dat.toString().split(' ')[0] !== "Hardware") {
        domCurrentElement.innerText = dat.toString().split(' ')[0];
        domVoltageElement.innerText = dat.toString().split(' ')[1];
        domPowerElement.innerText = (+(dat.toString().split(' ')[0])*(+(dat.toString().split(' ')[1])))/1000;
        domTemperatureElement.innerText = dat.toString().split(' ')[3];
        console.log(dat.toString())
    }
})
