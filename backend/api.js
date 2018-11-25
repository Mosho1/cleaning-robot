
const express = require('express');
const expressWs = require('express-ws');
const { Robot } = require('./robot');


module.exports.api = () => {
    const eWs = expressWs(express());

    eWs.app.ws('/robot', function (ws, req) {
        let robot;
        ws.on('message', async (data) => {
            if (robot) {
                robot.removeAllListeners();
            }
            robot = new Robot();
            const params = JSON.parse(data);
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