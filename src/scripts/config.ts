export interface Config {
    mqttUrl: string;
    platform: string;
}

export default (): Config => {
    return {
        mqttUrl: process.env['BLUE_OWL_MQTT_URL'] || 'mqtt://127.0.0.1:1883',
        platform: process.env['BLUE_OWL_PLATFORM'] || 'A',
    };
}
