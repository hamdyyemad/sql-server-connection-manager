async function testDashboardAPI() {
  console.log('Testing Dashboard API...');
  
  try {
    // Test with mock data
    const mockResponse = await fetch('http://localhost:3000/api/v1/dashboard?server=localhost&mock=true', {
      headers: {
        'Authorization': 'Bearer test-token',
        'Content-Type': 'application/json'
      }
    });

    if (mockResponse.ok) {
      const mockData = await mockResponse.json();
      console.log('✅ Mock data API test successful');
      console.log('Mock data received:', {
        employeeCount: mockData.employeeCount,
        screenCount: mockData.screenCount,
        actionCount: mockData.actionCount,
        employeeActionCount: mockData.employeeActionCount,
        isMock: mockData._mock
      });
    } else {
      console.log('❌ Mock data API test failed:', mockResponse.status);
    }

    // Test without mock (should return mock data due to connection failure)
    const realResponse = await fetch('http://localhost:3000/api/v1/dashboard?server=localhost', {
      headers: {
        'Authorization': 'Bearer test-token',
        'Content-Type': 'application/json'
      }
    });

    if (realResponse.ok) {
      const realData = await realResponse.json();
      console.log('✅ Real data API test successful (fallback to mock)');
      console.log('Data received:', {
        employeeCount: realData.employeeCount,
        screenCount: realData.screenCount,
        actionCount: realData.actionCount,
        employeeActionCount: realData.employeeActionCount,
        isMock: realData._mock,
        connectionError: realData._connectionError
      });
    } else {
      console.log('❌ Real data API test failed:', realResponse.status);
    }

  } catch (error) {
    console.error('❌ API test failed:', error.message);
  }
}

// Run the test
if (require.main === module) {
  testDashboardAPI().catch(console.error);
}

module.exports = { testDashboardAPI };
