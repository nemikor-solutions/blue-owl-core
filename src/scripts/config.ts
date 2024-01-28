export interface Config {
    mqttHost: string;
    mqttPassword: string | undefined;
    mqttPort: string;
    mqttUsername: string | undefined;
    platform: string;
    serialPort: string | undefined;
}

export default (): Config => {
    return {
        mqttHost: process.env['BLUE_OWL_MQTT_HOST'] || '127.0.0.1',
        mqttPassword: process.env['BLUE_OWL_MQTT_PASSWORD'],
        mqttPort: process.env['BLUE_OWL_MQTT_PORT'] || '1883',
        mqttUsername: process.env['BLUE_OWL_MQTT_USERNAME'],
        platform: process.env['BLUE_OWL_PLATFORM'] || 'A',
        serialPort: process.env['BLUE_OWL_SERIAL_PORT'],
    };
}
