
const express = require('express');
const expressWs = require('express-ws');
const { Robot } = require('./robot');


module.exports.api = () => {
    const eWs = expressWs(express());

    eWs.app.ws('/robot', function (ws, req) {
        ws.on('message', async (data) => {
            const params = JSON.parse(data);
            console.log(params);
            const robot = new Robot(params);
            robot.loadMap(params.map);
            robot.addListener('state', state => ws.send(JSON.stringify(state)));
            ws.on('close', () => {
                robot.removeAllListeners();
            });
            await robot.clean(1, 1);
        });
    });
    const aWss = eWs.getWss('/robot');

    return eWs.app;
}