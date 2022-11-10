# Blue Owl

Blue Owl provides Technical Official device integration for [OWLCMS](https://owlcms.github.io/owlcms4/) via a microcontroller powered by [Johnny-Five](http://johnny-five.io/).

## Overview

### Referees

Referee control boxes may be used in compliance with the IWF Referee Light System as documented in TCRR 3.3.6. The referee control boxes support:

* White and red buttons for "Good lift" and "No lift".
* White and red LEDs to confirm decision entry.
* Buzzer and/or vibration to signal when a decision is required.
* Buzzer and/or vibration to signal when summoned to the jury table.

#### Single Referee Mode

For competitions run with only one referee, simply configure all three referees with the same buttons. This will cause the single referee control box to send a decision for all three referees.



### Timekeeper

The timekeeper control box may be used to fully control the timing clock as documented in TCRR 7.10. The timekeeper control box supports:

* Starting the clock.
* Stopping the clock.
* Resetting the clock to one minute.
* Resetting the clock to two minutes.



### Jury

The jury control panel and jury control units may be used to fulfill all jury member requiremensts as documented in TCRR 3.3.6.11, TCRR 3.3.6.12, and TCRR 7.5. The jury control panel supports:

* Displaying referee decisions in real time.
* Displaying jury member decisions.
* Summoning a referee.
* Summoning the technical controller.
* Stopping the competition for deliberation.
* Stopping the competition for a technical break.
* Resuming the compeition.



## API

Each technical official is represented by a model, e.g., `Referee`. These models provide the logic and APIs necessary for the official, but do not provide any hardware-specific implementations. Instead, the models provide methods for actions that the official can perform and emits events for information provided by OWLCMS. Each model must be instantiated with a set of modules which provide the hardware-specific implementations.

### Types

The documentation uses a few custom types:

#### Decision

The strings `bad` and `good`.

#### JuryMemberNumber

The numbers `1`, `2`, `3`, `4`, and `5`.

#### RefereeNumber

The numbers `1`, `2`, and `3`.

### Owlcms

The `Owlcms` class provides the necessary APIs for two way communication between the models and OWLCMS. Unless you are building a custom integration with OWLCMS that does not use the provided models, the API provided by `Owlcms` will not be used directly.

#### constructor(options)

* `options`: Configuration options for OWLCMS.
    * `url`: The URL for the MQTT server that OWLCMS is connected to.



### Jury

#### constructor(options)

* `options`: Configuration options for the jury.
    * `members` (`Array<JuryMember>`): `JuryMember` instances for each of the three or five jury members.
    * `modules` (`Array<(jury: Jury) => void>`): A set of modules that provide hardware-specific implementations.
    * `owlcms` (`Owlcms`): An instance of `Owlcms`.
    * `platform` (`string`): The name of the platform.

#### Modules

##### buttons(options)

Provides functionality for starting and stopping the competition, including summoning other officials.

* `options`: Configure options for the buttons.
    * `board` (optional; `Board`): Which Johnny-Five board the buttons are connected to.
    * `deliberationButton` (`number | string`): Which pin the deliberation break button is connected to.
    * `resumeCompetitionButton` (`number | string`): Which pin the resume competition button is connected to.
    * `summonReferee1Button` (`number | string`): Which pin the summon referee 1 button is connected to.
    * `summonReferee2Button` (`number | string`): Which pin the summon referee 2 button is connected to.
    * `summonReferee3Button` (`number | string`): Which pin the summon referee 3 button is connected to.
    * `summonTechnicalControllerButton` (`number | string`): Which pin the summon technical controller button is connected to.
    * `technicalBreakButton` (`number | string`): Which pin the technical break button is connected to.

##### referee-leds(options)

Provides functionality for real-time referee decision LEDs.

* `options`: Configurat options for the LEDs.
    * `board` (optional; `Board`): Which Johnny-Five board the buttons are connected to.
    * `referee1BadLiftLed` (`number | string`): Which pin the referee 1 bad lift LED is connected to.
    * `referee1GoodLiftLed` (`number | string`): Which pin the referee 1 good lift LED is connected to.
    * `referee2BadLiftLed` (`number | string`): Which pin the referee 2 bad lift LED is connected to.
    * `referee2GoodLiftLed` (`number | string`): Which pin the referee 2 good lift LED is connected to.
    * `referee3BadLiftLed` (`number | string`): Which pin the referee 3 bad lift LED is connected to.
    * `referee3GoodLiftLed` (`number | string`): Which pin the referee 3 good lift LED is connected to.

#### Events

##### initialized

The model has been initialized.

##### refereeDecision(data)

A referee decision has been made.

* `data`: Data about the decision.
    * `decision` (`Decision`): The referee's decision.
    * `number` (`RefereeNumber`): The number indicating which referee made the decision.

##### resetRefereeDecisions

The referee decisions should be cleared because a clock has started for a new attempt.

#### Methods

##### publishDecision(data)

Publish a jury member's decision for the current attempt.

* `data`: Data about the decision.
    * `decision` (`Decision`): The jury members's decision of whether the lift was good or bad.
    * `number` (`JuryMemberNumber`): The number indicating which jury member made the decision.

##### resumeCompetition()

Resume the competition.

##### startDeliberation()

Stop the competition for the jury to deliberate about the previous attempt.

##### startTechnicalBreak()

Stop the competition for a technical break.

##### summonReferee(referee)

Summon a referee to the jury table.

* `referee` (`RefereeNumber`): The number of the referee to summon.

##### summonTechnicalController()

Summon the technical controller to the jury table.



### JuryMember

#### constructor(options)

* `options`: Configuration options for the jury member.
    * `modules` (`Array<(juryMember: JuryMember) => void>`): A set of modules that provide hardware-specific implementations.
    * `number` (`JuryMemberNumber`): The jury memeber number.
    * `owlcms` (`Owlcms`): An instance of `Owlcms`.
    * `platform` (`string`): The name of the platform.

#### Modules

##### buttons(options)

Provides functionality for good and bad lift buttons to submit the jury member's decision.

* `options`: Configuration options for the buttons.
    * `badLiftButton` (`number | string`): Which pin the bad lift button is connected to.
    * `board` (optional; `Board`): Which Johnny-Five board the buttons are connected to.
    * `goodLiftButton` (`number | string`): Which pin the good lift button is connected to.

##### rgb-led(options)

Provides functionality for displaying the jury member's decision on the jury panel. When a decision is made, the light will turn green and when all jury members have made a decision, the light will chnge to white or red to indicate a good or bad lift.

* `options`: Configuration options for the RGB LED.
    * `anode` (optional; `boolean`): Whether the RGB LED is common anode.
    * `board` (optional; `Board`): Which Johnny-Five board the buttons are connected to.
    * `pins` (object with `red`, `green`, and `blue` keys): Which pin each of the RGB LED leads is conneccted to.

#### Evens

##### decision(data)

The jury member has made a decision about the current attempt.

* `data`: Data about the decision being revealed.
    * `decision` (`Decision`): Whether the lift was good or bad.

##### reset

##### reveal(data)

Reveal the decision on the jury panel because all jury members have sumitted a decision.

* `data`: Data about the decision being revealed.
    * `decision` (`Decision`): Whether the lift was good or bad.

#### Methods

##### publishDecision(decision)

Publish the jury member's decision for the current attempt.

* `decision` (`Decision`): The jury members's decision of whether the lift was good or bad.

##### resetDecision()

Reset the decision because a clock has started for a new attempt.

##### revealDecision()

Reveal the decision on the jury panel because all jury members have sumitted a decision.



### Referee

#### constructor(options)

* `options`: Configuration options for the referee.
    * `modules` (`Array<(referee: Referee) => void>`): A set of modules that provide hardware-specific implementations.
    * `number` (`RefereeNumber`): The referee number, with `1` being the referee on the left.
    * `owlcms` (`Owlcms`): An instance of `Owlcms`.
    * `platform` (`string`): The name of the platform.

#### Modules

##### buttons(options)

Provides functionality for good and bad lift buttons to submit the referee's decision.

* `options`: Configuration options for the buttons.
    * `badLiftButton` (`number | string`): Which pin the bad lift button is connected to.
    * `board` (optional; `Board`): Which Johnny-Five board the buttons are connected to.
    * `goodLiftButton` (`number | string`): Which pin the good lift button is connected to.

##### buzzer(options)

Provides audible feedback to the referee, via a piezo buzzer, when a decision is required and when the jury summons the referee.

* `options`: Configuration options for the buzzer.
    * `board` (optional; `Board`): Which Johnny-Five board the buzzer is connected to.
    * `piezo` (`number | string`): Which pin the buzzer is connected to.

##### leds(options)

Provides visual confirmation that OWLCMS has acknowledged the decision.

* `options`: Configuration options for the LEDs.
    * `badLiftLed` (`number | string`): Which pin the bad lift LED is connected to.
    * `board` (optional; `Board`): Which Johnny-Five board the LEDs are connected to.
    * `goodLiftLed` (`number | string`): Which pin the good lift LED is connected to.

*NOTE: `badLiftLed` and `goodLiftLed` may be set to the same pin if a single LED is being used to confirm the decision was submitted, without indicating which decision was submitted.*

##### vibration(options)

Provides tactile feedback to the referee, via a vibration motor, when a decision is required and when the jury summons the referee.

* `options`: Configuration options for the vibration motor.
    * `board` (optional; `Board`): Which Johnny-Five board the vibration motor is connected to.
    * `vibrationMotor` (`number | string`): Which pin the vibration motor is connected to.

#### Events

The `Referee` class emits the following events:

##### decisionConfirmed(data)

OWLCMS has acknowledged the referee's decision.

* `data`: Data about the decision confirmation.
    * `decision` (`Decision`): The decision that was acknowledged by OWLCMS.

##### decisionRequest

The other two referees have made a decision and the athlete is waiting for a decision from the final referee.

##### initialized

The model has been initialized.

##### summon

The jury has summoned the referee to the jury table.

#### Methods

##### publishDecision(decision)

Publish a decision for the current attempt.

* `decision` (`Decision`): The referee's decision of whether the lift was good or bad.



### Timekeeper

#### constructor(options)

* `options`: Configuration options for the timekeeper.
    * `modules` (`Array<(timekeeper: Timekeeper) => void>`): A set of modules that provide hardware-specific implementations.
    * `owlcms` (`Owlcms`): An instance of `Owlcms`.
    * `platform` (`string`): The name of the platform.

#### Modules

##### buttons(options)

Provides functionality for controlling the clock.

* `options`: Configuration options for the buttons.
    * `board` (optional; `Board`): Which Johnny-Five board the buttons are connected to.
    * `oneMinuteButton` (`number | string`): Which pin the one minute button is connected to.
    * `startButton` (`number | string`): Which pin the start button is connected to.
    * `stopButton` (`number | string`): Which pin the stop button is connected to.
    * `twoMinuteButton` (`number | string`): Which pin the two minute button is connected to.

#### Events

##### initialized

The model has been initialized.

#### Methods

##### oneMinuteClock()

Reset the clock to one minute.

##### startClock()

Start (resume) the clock.

##### stopClock()

Stop (pause) the clock.

##### twoMinuteClock()

Reset the clock to two minutes.



## License

Copyright Scott González. Released under the terms of the ISC license.
