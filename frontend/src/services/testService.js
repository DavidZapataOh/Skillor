export class TestService {
  static async runTest(userCode, testCode) {
    try {
      const getTestFunction = new Function(testCode);
      const testFunction = getTestFunction();
      
      const result = testFunction(userCode);
      
      return {
        passed: result.passed,
        error: result.error
      };
    } catch (error) {
      console.error('Test execution error:', error);
      return {
        passed: false,
        error: error.message || 'Error ejecutando el test'
      };
    }
  }
} 