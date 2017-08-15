# Arduino Data Read

Data acquisition of the analog input for Arduino.

The acquisition routine is a server written in node.js and uses the library [johnny-five](http://johnny-five.io/) for Arduino.

The GUI is implemented with a web app connected to the server using [socket.io](https://github.com/socketio/socket.io).

## Containerized version

The Dockerfile is an attempt of wrapping the application in a Docker container.
The trouble with this approach is that the USB port is not accessed by the container by default in OSX and Windows. See [this link](https://medium.com/google-cloud/developing-for-arduino-with-docker-and-johnny-five-on-osx-cc6813ae6e9d) to learn how to use Arduino with Docker through the USB. For USB 3, the [Oracle VM VirtualBox Extension Pack](https://www.virtualbox.org/wiki/Downloads) for Virtual Box is required.

> Jesús Martínez-Blanco

> jmb.jesus@gmail.com
