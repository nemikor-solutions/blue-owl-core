## Simple Refereeing Box

diagram.json is the plain referee device used in conjunction with a laptop that gives a down signal and sound.

## Full Refereeing Box with External Tower

diagramDown.json adds the relays to trigger a light and a buzzer.

> When using Wokwi to better see the pin numbers, you will need to copy diagramDown.json content into the diagram.json file.

In the diagram, a blue LED represents the down signal light (relay triggered by pin A0) and the yellow LED represents the buzzer (relay triggered by pin A1)

The simulator does not have a symbol for 240/120/24V as required by the equipment, so the VCC symbol connected to the relay stands for the live higher voltage wire.