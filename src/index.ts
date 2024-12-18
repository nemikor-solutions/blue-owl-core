export {
    Board,
    Expander,
} from 'johnny-five';

export type {
    BoardOptions,
} from '@lib/board';
export { default as connectBoard } from '@lib/board';

export type {
    Official,
    OwlcmsClockStartEvent,
    OwlcmsConfigEvent,
    OwlcmsDecisionEvent,
    OwlcmsDecisionRequestEvent,
    OwlcmsDownEvent,
    OwlcmsOptions,
    OwlcmsResetDecisionsEvent,
    OwlcmsSummonEvent,
} from '@lib/owlcms';
export { default as Owlcms } from '@lib/owlcms';

export type {
    LogEventData,
    Logger,
    LogSubscriber,
} from '@lib/logger';
export {
    createLogger,
    onMessage,
} from '@lib/logger';

export type {
    CoreModelEvents,
    CoreModelOptions,
} from '@lib/model/core';
export { default as CoreModel } from '@lib/model/core';

export type {
    ModelEvents,
    ModelOptions,
} from '@lib/model/index';
export { default as Model } from '@lib/model/index';

export type {
    DownSignalOptions,
    TimeRemaining,
} from '@lib/model/down-signal/index';
export { default as DownSignal } from '@lib/model/down-signal/index';

export type {
    DownSignalClockRelayOptions,
} from '@lib/model/down-signal/clock-relay';
export { default as downSignalClockRelay } from '@lib/model/down-signal/clock-relay';

export type {
    DownSignalRelayOptions,
} from '@lib/model/down-signal/relay';
export { default as downSignalRelay } from '@lib/model/down-signal/relay';

export type {
    JuryMemberNumber,
    JuryOptions,
    JuryRefereeDecisionEvent,
} from '@lib/model/jury/index';
export { default as Jury } from '@lib/model/jury/index';

export type {
    JuryButtonsOptions,
} from '@lib/model/jury/buttons';
export { default as juryButtons } from '@lib/model/jury/buttons';

export type {
    JuryRefereeLedsOptions,
} from '@lib/model/jury/referee-leds';
export { default as juryRefereeLeds } from '@lib/model/jury/referee-leds';

export type {
    JuryRefereeRgbLedsOptions,
} from '@lib/model/jury/referee-rgb-leds';
export { default as juryRefereeRgbLeds } from '@lib/model/jury/referee-rgb-leds';

export type {
    JuryMemberDecisionEvent,
    JuryMemberOptions,
} from '@lib/model/jury-member/index';
export { default as JuryMember } from '@lib/model/jury-member/index';

export type {
    JuryMemberButtonsOptions,
} from '@lib/model/jury-member/buttons';
export { default as juryMemberButtons } from '@lib/model/jury-member/buttons';

export type {
    JuryMemberLedsOptions,
} from '@lib/model/jury-member/leds';
export { default as juryMemberLeds } from '@lib/model/jury-member/leds';

export type {
    JuryMemberRgbLedOptions,
} from '@lib/model/jury-member/rgb-led';
export { default as juryMemberRgbLed } from '@lib/model/jury-member/rgb-led';

export type {
    Decision,
    RefereeDecisionEvent,
    RefereeNumber,
    RefereeOptions,
} from '@lib/model/referee/index';
export { default as Referee } from '@lib/model/referee/index';

export type {
    RefereeButtonsOptions,
} from '@lib/model/referee/buttons';
export { default as refereeButtons } from '@lib/model/referee/buttons';

export type {
    RefereeBuzzerOptions,
} from '@lib/model/referee/buzzer';
export { default as refereeBuzzer } from '@lib/model/referee/buzzer';

export type {
    RefereeConfirmationLedsOptions,
} from '@lib/model/referee/confirmation-leds';
export { default as refereeConfirmationLeds } from '@lib/model/referee/confirmation-leds';

export type {
    RefereeVibrationOptions,
} from '@lib/model/referee/vibration';
export { default as refereeVibration } from '@lib/model/referee/vibration';

export type {
    RefereeWarningLedOptions,
} from '@lib/model/referee/warning-led';
export { default as refereeWarningLed } from '@lib/model/referee/warning-led';

export type {
    TimekeeperOptions,
} from '@lib/model/timekeeper/index';
export { default as Timekeeper } from '@lib/model/timekeeper/index';

export type {
    TimekeeperButtonsOptions,
} from '@lib/model/timekeeper/buttons';
export { default as timekeeperButtons } from '@lib/model/timekeeper/buttons';
