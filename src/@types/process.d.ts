declare module 'process' {
    global {
        namespace NodeJS {
            interface ProcessEnv {
                MQTT_URL: string;
                PLATFORM: string;

                REFEREE1_BAD_LIFT_BUTTON: string;
                REFEREE1_BAD_LIFT_LED: string;
                REFEREE1_GOOD_LIFT_BUTTON: string;
                REFEREE1_GOOD_LIFT_LED: string;
                REFEREE1_VIBRATION_MOTOR: string;

                REFEREE2_BAD_LIFT_BUTTON: string;
                REFEREE2_BAD_LIFT_LED: string;
                REFEREE2_GOOD_LIFT_BUTTON: string;
                REFEREE2_GOOD_LIFT_LED: string;
                REFEREE2_VIBRATION_MOTOR: string;

                REFEREE3_BAD_LIFT_BUTTON: string;
                REFEREE3_BAD_LIFT_LED: string;
                REFEREE3_GOOD_LIFT_BUTTON: string;
                REFEREE3_GOOD_LIFT_LED: string;
                REFEREE3_VIBRATION_MOTOR: string;
            }
        }
    }
}
