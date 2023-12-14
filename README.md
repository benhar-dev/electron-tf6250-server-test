# TF6250 Server Test

## Description

This application is designed to test the basic functionality of the Beckhoff TF6250 Modbus Server using default configurations. It provides the flexibility to choose between a local server (`127.0.0.1`) or to input a specific IP address. Users can also select which tests to run, with all tests running by default.

For infomation about the tests, and failure checklists please see [here](https://github.com/benhar-dev/electron-tf6250-server-test/blob/main/README.md#tests-common-error-messages-and-checks)
## Screenshot

![image](./docs/images/Screenshot.png)

## Getting Started using installer

Download and run the [TF6250.Server.Tester.Setup.1.1.0.exe](https://github.com/benhar-dev/electron-tf6250-server-test/releases/download/v1.1.0/TF6250.Server.Tester.Setup.1.1.0.exe).

## Getting Started with your Modbus Server IPC. 

### Windoows 10

1. Download and install TF6250
2. Download the default configuration TcModbusSrv.xml file found [here](https://github.com/benhar-dev/electron-tf6250-server-test/tree/main/examples/server%20configuration) (this is in the examples/server configuration folder of this repo)
3. Import the default configuration XML
   a. The TF6250 configurator is installed per default to the directory C:\TwinCAT\Functions\TF6250-Modbus-TCP\Win32\Server
   b. Double click TcModbusSrvCfg.exe to open the configurator
   c. When asked "TwinCAT system has to be stopped.  Should TwinCAT be stopped? Press YES (if safe to do so!)
   d. Click Import
   e. Navigate to the downloaded TcModbusSrv.xml and press Open
   f. The import is silent, so press the X to close the configurator
4. Open the example project in TwinCAT found [here](https://github.com/benhar-dev/electron-tf6250-server-test/tree/main/examples/twincat/ExampleProject). (this is in the examples/twincat folder of this repo)
5. Ensure you have enabled the TF6250 Trial License
6. Activate, Login and Run the PLC project

### Windoows CE

1. Download and install TF6250
2. Extract and install the CAB file to the CE device using instructions [here](https://infosys.beckhoff.com/english.php?content=../content/1033/tf6250_tc3_modbus_tcp/705884939.html&id=1509253777466000053)
3. Download the default configuration TcModbusSrv.xml file found [here](https://github.com/benhar-dev/electron-tf6250-server-test/tree/main/examples/server%20configuration) (this is in the examples/server configuration folder of this repo)
4. Copy the default configuration XML to the TF6250 server folder on the CE device
5. Open the example project in TwinCAT found [here](https://github.com/benhar-dev/electron-tf6250-server-test/tree/main/examples/twincat/ExampleProject). (this is in the examples/twincat folder of this repo)
6. Ensure you have enabled the TF6250 Trial License
7. Activate, Login and Run the PLC project

### Running the tests

1. Select either local, or type in the IP address of your Modbus Server IPC
2. Press "Start" to begin the tests

## Tests, Common Error Messages and Checks

### TEST - Check ip address:
This test's the validity of the IP address.  A malformed IP addres will cause the test to fail.

### TEST - Check connection to port:
This checks to see if port 502 is open on the IP address.  It does not check to see if Modbus is available, only that the port is open for communication. 

Failure checklist 
   - Ensure that 502 TCP is open on the server firewall
   - Ensure that TF6250 has been installed and the correct default configuration has been imported
   - Ensure that TwinCAT is running

### TEST - Check connection:
This checks the Modbus connection to the server.  A pass indicates that TF6250 has been found and the service is operational

Failure checklist 
   - Ensure that no other software has been installed which is using port 502
   - Ensure that TwinCAT is running

### TEST - Write to first coil:
This checks to see if the TF6250 Modbus Server correctly passes a write request on input coil 32768, to the TwinCAT GVL.mb_Output_Coils[0].

Failure notes
We know that if the previous tests have passed, then the issue is with the configuration of the server and/or your TwinCAT program.  The XML file directs writes to output coil 32768, to the TwinCAT GVL.mb_Output_Coils[0].  If this is not possible then you will see errors relating to "Modbus exception 2: illegal data address (register not supported by device)"

Failure checklist 
   - Ensure that the correct default configuration has been imported.  This is a very important step!  See "Getting Started with your Modbus Server IPC" above
   - Ensure that TwinCAT is running
   - Ensure that the GVL is correct
   - Ensure that TwinCAT PLC is in run

### TEST - Write to first register:
This checks to see if the TF6250 Modbus Server correctly passes a write request on output register 32768, to the TwinCAT GVL.mb_Output_Registers[0].

Failure notes
We know that if the previous tests have passed, then the issue is with the configuration of the server and/or your TwinCAT program.  The XML file directs writes to output register 32768, to the TwinCAT GVL.mb_Output_Registers[0].  If this is not possible then you will see errors relating to "Modbus exception 2: illegal data address (register not supported by device)"

Failure checklist 
   - Ensure that the correct default configuration has been imported.  This is a very important step!  See "Getting Started with your Modbus Server IPC" above
   - Ensure that TwinCAT is running
   - Ensure that the GVL is correct
   - Ensure that TwinCAT PLC is in run

## Developing and Building using Node

These steps are only required if you wish to build, run and deploy your own version of the tool.  The pre-build version of the tool can be found in the releases folder. 

### Prerequisites

- Node.js (latest stable version)
- npm (comes with Node.js)

### Installation

#### Building from Source

1. Clone the repository:

   ```bash
   git clone https://github.com/benhar-dev/electron-tf6250-server-test.git
   ```

2. Navigate to the cloned directory:

   ```bash
   cd electron-tf6250-server-test
   ```

3. Install the dependencies:
   ```bash
   npm install
   ```

### Usage

To start the application, run the following command in the project directory:

```bash
npm start
```

### Building for Production

To build the application for production, use the following commands:

```bash
npm run dist
```

This will create a distribution using electron-builder and will generate necessary licenses and notices as part of the build process.
