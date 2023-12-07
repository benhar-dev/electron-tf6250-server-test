const ModbusRTU = require("modbus-serial");

document.getElementById("startTest").addEventListener("click", async () => {
  document.getElementById("testResults").innerHTML = ""; // Clear previous results

  let ipAddress = getIpAddress();
  if (!ipAddress) {
    alert("Please enter an IP address.");
    return;
  }

  // await executeTest(runTest1, "Test Create Connection", ipAddress);

  tests.forEach(async (test) => {
    if (document.getElementById(test.name).checked) {
      executeTest(test.func, test.name, ipAddress);

      // try {
      //   await test.func(ipAddress);
      //   // Display success for each test
      //   displayResult(test.name, true, 'Complete');
      // } catch (error) {
      //   // Display error for each test
      //   displayResult(test.name, false, error.message);
      // }
    }
  });
});

// Example array of tests
const tests = [
  { name: "Test 1", func: runTest1 },
  { name: "Test 2", func: runTest1 },
  // Add more tests here
];

// Function to display tests
function loadTests() {
  const testsListDiv = document.getElementById("testsList");
  testsListDiv.innerHTML = ""; // Clear existing content
  tests.forEach((test) => {
    const checkBox = document.createElement("input");
    checkBox.type = "checkbox";
    checkBox.id = test.name;
    checkBox.checked = true;

    const label = document.createElement("label");
    label.htmlFor = test.name;
    label.textContent = test.name;

    testsListDiv.appendChild(checkBox);
    testsListDiv.appendChild(label);
    testsListDiv.appendChild(document.createElement("br"));
  });
}

function toggleTestsDisplay() {
  const testsDiv = document.getElementById("tests");
  const testsListDiv = document.getElementById("testsList");
  if (testsDiv.style.maxHeight) {
    // Panel is open, so close it
    testsDiv.style.maxHeight = null;
  } else {
    if (!testsListDiv.innerHTML) loadTests(); // Display tests only if not already displayed
    // Set max-height to the panel's scrollHeight for smooth expansion
    testsDiv.style.maxHeight = testsDiv.scrollHeight + "px";
  }
}

function displayResult(testName, success, message) {
  const resultsDiv = document.getElementById("testResults");
  const result = document.createElement("div");
  result.innerHTML = `${testName}: ${
    success
      ? '<span style="color: green;">&#10004;</span>'
      : '<span style="color: red;">Fail</span>'
  } ${message}`;
  resultsDiv.appendChild(result);
}

document
  .getElementById("showTests")
  .addEventListener("click", toggleTestsDisplay);

async function executeTest(testFunction, testName, ipAddress) {
  function pass(message) {
    displayResult(testName, true, message);
  }

  function fail(message) {
    displayResult(testName, false, message);
  }

  const client = new ModbusRTU();
  try {
    await client.connectTCP(ipAddress, { port: 502 });
    await testFunction(client, pass, fail);
  } catch (error) {
    fail(error.message);
  }
}

function getIpAddress() {
  const ipType = document.querySelector('input[name="ipType"]:checked').value;
  if (ipType === "local") {
    return "127.0.0.1";
  } else {
    return document.getElementById("ipAddress").value;
  }
}

async function runTest1(client, pass, fail) {
  // Replace with your actual test logic

  await client.writeCoil(32768, true);
  let val = await client.readInputRegisters(0x8000, 1);
  pass("complete");
  fail("fa");
  displayResult(testName, true, "Complete");
}

loadTests();
