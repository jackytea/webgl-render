# WebGL First Person Render

## Overview

A first person movement demonstration using WebGL 3D rendering.


## External Libraries and Tools Used

[Three.JS](https://threejs.org/) - a JavaScript library and API for 3D Graphics.

[Keeny.nl](https://kenney.nl/) - online asset market place for game models.

MTLLoader.JS - MTL Resource loader by [angelxuanchang](https://github.com/angelxuanchang).

OBJLoader.JS - OBJ Resource loader by [mrdoob](https://github.com/mrdoob).

**Credit is given where due for these tools.**


## Techniques

All calculations were based off a 3D Cartesian plane denoted by the X-Axis (red line), Y-Axis (green line) and the Z-axis (blue line).

![3D Cartesian Plane](./demos/3D_Plane.svg)

Radians were used to determine the degree of rotation.

![Radian Chart](./demos/Radians.svg)

**Locking The Camera**

Moving forwards ('w' key is being pressed):

*X<sub>cameraPosition</sub> = X<sub>cameraPosition</sub> - sin(Y<sub>cameraRotation</sub>) - V<sub>mouseVelocity</sub>*

*Z<sub>cameraPosition</sub> = Z<sub>cameraPosition</sub> - (-cos(Y<sub>cameraRotation</sub>)) - V<sub>mouseVelocity</sub>*


Moving backwards ('s' key is being pressed):

*X<sub>cameraPosition</sub> = X<sub>cameraPosition</sub> + sin(Y<sub>cameraRotation</sub>) - V<sub>mouseVelocity</sub>*

*Z<sub>cameraPosition</sub> = Z<sub>cameraPosition</sub> - (-cos(Y<sub>cameraRotation</sub>)) - V<sub>mouseVelocity</sub>*


Strafing left ('a' key is being pressed):

*X<sub>cameraPosition</sub> = X<sub>cameraPosition</sub> + sin(Y<sub>cameraRotation</sub> + π / 2) - V<sub>mouseVelocity</sub>*

*Z<sub>cameraPosition</sub> = Z<sub>cameraPosition</sub> - (-cos(Y<sub>cameraRotation</sub> + π / 2)) - V<sub>mouseVelocity</sub>*


Strafing right ('d' key is being pressed):

*X<sub>cameraPosition</sub> = X<sub>cameraPosition</sub> + sin(Y<sub>cameraRotation</sub> - π / 2) - V<sub>mouseVelocity</sub>*

*Z<sub>cameraPosition</sub> = Z<sub>cameraPosition</sub> - (-cos(Y<sub>cameraRotation</sub> - π / 2)) - V<sub>mouseVelocity</sub>*


Turning camera right ('right arrow ->' key is being pressed):

*Y<sub>cameraRotation</sub> = Y<sub>cameraRotation</sub> + V<sub>mouseVelocity</sub>*


Turning camera left ('left arrow <-' key is being pressed):

*Y<sub>cameraRotation</sub> = Y<sub>cameraRotation</sub> - V<sub>mouseVelocity</sub>*

**First Person Model Tracking**

Positioning:

*X<sub>cameraPosition</sub> = X<sub>cameraPosition</sub> - sin(Y<sub>cameraRotation</sub> + π / 6) * C*

*Y<sub>cameraPosition</sub> = Y<sub>cameraPosition</sub> - C + sin(X<sub>cameraPosition</sub> + Z<sub>cameraPosition</sub>) * C*

*Z<sub>cameraPosition</sub> = Z<sub>cameraPosition</sub> - cos(Y<sub>cameraRotation</sub> + π / 6) * C*

Rotation:

*X<sub>cameraRotation</sub> = X<sub>cameraRotation</sub>*

*Y<sub>cameraRotation</sub> = Y<sub>cameraRotation</sub> - π (ensures that the model faces the right way.)* 

*Z<sub>cameraRotation</sub> = Z<sub>cameraRotation</sub>*

**Projectile Calculations**

*V<sub>projectileVelocityX</sub> = sin(Y<sub>cameraRotation</sub>)*

*V<sub>projectileVelocityY</sub> = 0*

*V<sub>projectileVelocityZ</sub> = cos(Y<sub>cameraRotation</sub>)*

## Controls

| **Key**         |    **Movement**    |
| --------------- | :----------------: |
| W               |   Walk forward.    |
| S               |   Walk backward.   |
| A               |    Strafe left.    |
| D               |   Strafe right.    |
| Space Bar       |    Fire weapon.    |
| Left Arrow Key  | Turn camera left.  |
| Right Arrow Key | Turn camera right. |

## Demo GIFs

![First person demonstration](./demos/demo.gif)
