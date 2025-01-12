export class TestService {
  static async validateCode(code) {
    try {
      const response = await fetch('/api/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, tests: [] })
      });

      const data = await response.json();
      return {
        valid: data.passed,
        error: data.tests[0]?.error
      };
    } catch (error) {
      return {
        valid: false,
        error: error.message
      };
    }
  }

  static async runTests(code, tests) {
    const response = await fetch('/api/test', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code, tests })
    });

    const data = await response.json();
    return data.tests;
  }
} 