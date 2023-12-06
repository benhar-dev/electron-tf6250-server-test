const ModbusRTU = require("modbus-serial");

document.getElementById("startTest").addEventListener("click", async () => {
  document.getElementById("testResults").innerHTML = ""; // Clear previous results

  let ipAddress = getIpAddress();
  if (!ipAddress) {
    alert("Please enter an IP address.");
    return;
  }

  await executeTest(runTest1, "Test Create Connection", ipAddress);
});

async function executeTest(testFunction, testName, ipAddress) {
  const client = new ModbusRTU();
  try {
    await client.connectTCP(ipAddress, { port: 502 });
    await testFunction(client);
  } catch (error) {
    displayResult(testName, false, error.message);
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

document.querySelectorAll('input[name="ipType"]').forEach((input) => {
  input.addEventListener("change", () => {
    const customIpField = document.getElementById("ipAddress");
    if (input.value === "custom") {
      customIpField.disabled = false;
    } else {
      customIpField.disabled = true;
      customIpField.value = "";
    }
  });
});

async function runTest1(client) {
  // Replace with your actual test logic

  await client.writeCoil(32768, true);
  let val = await client.readInputRegisters(0x8000, 1);

  // Check the test result here and call displayResult accordingly
  // Assuming test is successful if no exceptions
  displayResult("Test 1", true, "Complete");
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
