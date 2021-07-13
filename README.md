# AWS IoT Device Simulator

## Overview

This document will help your device connect to AWS IoT quickly. Mainly to speed up the process of certificate exchanging complied to AWS IoT authentication.

## Prepare

Environment

- Create "certs" directory in your develop path.

Packages

- AWS IoT SDK for JavaScript https://github.com/aws/aws-iot-device-sdk-js

sensor.live

- Enable SATR on sensor.live, you will get root_ca.cert.pem, ca.cert.pem and ca.private_key.pem.
- Put the pem files into ./certs directory.

## Installation

```
npm install @softchef/iot-just-in-time-registration

or

yarn add @softchef/iot-just-in-time-registration
```
## Examples

[Example code](https://github.com/SoftChefiot-just-in-time-registration-javascript/tree/main/example/)

## API Documentation

#### ThingRegistry.generateDeviceCertificate(thingName, options)

Default options:
```
options = {
    countryName = 'TW',
    stateName = 'Taipei',
    localityName = 'Neihu',
    organizationName = 'SoftChef',
    organizationUnitName = 'IT'
}
```
You can customize the thing name, please ensure the thing name is given uniquely.

The naming rule is based on AWS IoT requirement: Must contain only alphanumeric characters and/or the following: -_:

If your thing_name is null, alternatively, the thing name will generate from the device certificate.

#### ThingRegistry.thingName

Get the thing name. Your customized name or from the device certificate.

#### ThingRegistry.keysPath

Return the keys path, properties follow AWS IoT connection options.

#### ThingRegistry.setCertsPath(path)

Change the default certificate files directory.

#### ThingRegistry.setCACertificateName(name)

Change the default CA certificate file name.

#### ThingRegistry.setCAPrivateKeyName(name)

Change the default CA private key file name.

#### ThingRegistry.setRootCACertificateName(name)

Change the default RootCA certificate file name.

#### ThingRegistry.setDeviceCsrName(name)

Change the default device certificate request file name.

#### ThingRegistry.setDeviceCertificateName(name)

Change the default device certificate file name.

#### ThingRegistry.setDevicePublicKeyName(name)

Change the default device public key file name.

#### ThingRegistry.setDevicePrivateKeyName(name)

Change the default device private key file name.

## License

This SDK is distributed under the GNU GENERAL PUBLIC LICENSE Version 3, see LICENSE for more information.
