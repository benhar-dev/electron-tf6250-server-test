const ModbusRTU = require("modbus-serial");
const net = require("net");

const MODBUS_PORT = 502;

function initializeApp() {
  const lastIpAddress = localStorage.getItem("lastIpAddress");
  if (lastIpAddress) {
    document.getElementById("ipAddress").value = lastIpAddress;
  }

  document.getElementById("ipAddress").addEventListener("input", (event) => {
    localStorage.setItem("lastIpAddress", event.target.value);
  });

  document.getElementById("startTest").addEventListener("click", startTests);
  document
    .getElementById("showTests")
    .addEventListener("click", toggleTestsDisplay);
  loadTests();
}

async function startTests() {
  clearTestResults();

  const ipAddress = getIpAddress();
  const tests = getSelectedTests();

  displayInfomation("Tests starting.");
  try {
    for (const test of tests) {
      await executeTest(test.func, test.name, ipAddress);
    }
    displayInfomation("Tests complete!");
  } catch (error) {
    displayInfomation("Tests aborted due to failure.");
  }
}

function getSelectedTests() {
  return modbusTests.filter(
    (test) => document.getElementById(test.name).checked
  );
}

function clearTestResults() {
  document.getElementById("testResults").innerHTML = "";
}

function toggleTestsDisplay() {
  const testsDiv = document.getElementById("tests");
  toggleElementDisplay(testsDiv);
}

function toggleElementDisplay(element) {
  element.style.maxHeight = element.style.maxHeight
    ? null
    : element.scrollHeight + "px";
}

async function executeTest(testFunction, testName, ipAddress) {
  try {
    await testFunction(ipAddress);
    displayResult(testName, true, "Complete");
  } catch (error) {
    displayResult(testName, false, error.message);
    throw error;
  }
}

function displayResult(testName, success, message) {
  const resultsDiv = document.getElementById("testResults");
  resultsDiv.innerHTML += `<div> ${
    success
      ? '<span style="color: #90EE90;">[Pass]</span>'
      : '<span style="color: red;">[Fail]</span>'
  } ${testName}: ${message}</div>`;
}

function displayInfomation(message) {
  const resultsDiv = document.getElementById("testResults");
  resultsDiv.innerHTML += `<div> ${message}</div>`;
}

function getIpAddress() {
  const ipType = document.querySelector('input[name="ipType"]:checked').value;
  return ipType === "local"
    ? "127.0.0.1"
    : document.getElementById("ipAddress").value;
}

function loadTests() {
  const testsListDiv = document.getElementById("testsList");
  testsListDiv.innerHTML = modbusTests
    .map(
      (test) =>
        `<input type="checkbox" id="${test.name}" checked><label class="checkLabel" for="${test.name}">${test.name}</label><br>`
    )
    .join("");
}

async function ExampleTest(ipAddress) {
  // if the test is successful, you just return.
  // if the test raises an exception then this will be reported by the runner automatically.
  // however if you want to catch and reraise a new exception then wrap your code as below.
  /*
  try {
    // your code
  } catch (error) {
    if (error.code === "SPECIFIC_ERROR_CODE") {
      throw new Error("Custom error message");
    } else {
      // Re-throw the error if it's not the one you're looking for
      throw error;
    }
  }
  */
}

async function CheckIpAddress(ipAddress) {
  const regExp =
    /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(\.?(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/;
  if (!regExp.test(ipAddress)) {
    throw new Error(`Invalid IPv4 address: ${ipAddress}`);
  }
}

async function ConnectionCheck(ipAddress) {
  const client = new ModbusRTU();
  await client.connectTCP(ipAddress, { port: MODBUS_PORT });
}

function PortCheck(ipAddress, timeout = 5000) {
  return new Promise((resolve, reject) => {
    const client = new net.Socket();
    const timer = setTimeout(() => {
      client.destroy();
      reject(new Error(`Connection to ${ipAddress} timed out`));
    }, timeout);

    client.connect(MODBUS_PORT, ipAddress, () => {
      clearTimeout(timer);
      client.end();
      resolve();
    });

    client.on("error", (err) => {
      clearTimeout(timer);
      reject(
        new Error(
          `Unable to connect to port ${MODBUS_PORT} at ${ipAddress}: ${err.message}`
        )
      );
    });
  });
}

async function WriteToFirstCoil(ipAddress) {
  const client = new ModbusRTU();
  await client.connectTCP(ipAddress, { port: MODBUS_PORT });
  await client.writeCoil(32768, true);
}

async function WriteToFirstRegister(ipAddress) {
  const client = new ModbusRTU();
  await client.connectTCP(ipAddress, { port: MODBUS_PORT });
  await client.writeRegister(32768, 0xffff);
}

const modbusTests = [
  { name: "Check ip addresss", func: CheckIpAddress },
  { name: "Check connection to port", func: PortCheck },
  { name: "Check connection", func: ConnectionCheck },
  { name: "Write to first coil", func: WriteToFirstCoil },
  { name: "Write to first register", func: WriteToFirstRegister },
  // Add more tests here
];

initializeApp();
