export const generateInitialChallenge = (area) => {
  const baseTemplates = {
    solidity: {
      id: 'solidity-001',
      title: 'Introduction to Solidity',
      description: 'Create your first smart contract',
      theory: 'Smart contracts are programs stored on a blockchain...',
      example: 'contract Example { uint public value; }',
      requirements: [
        'Create a basic smart contract',
        'Add a state variable',
        'Implement a function to modify it'
      ],
      testCases: [
        {
          name: 'Basic Contract Test',
          description: 'Verifies contract compilation',
          testCode: `
            return function testSolution(userCode) {
              try {
                // Verificar que el contrato tiene una variable value
                if (!userCode.includes('value')) {
                  return { passed: false, error: 'El contrato debe tener una variable llamada value' };
                }
                // Verificar que la variable es pública
                if (!userCode.includes('public value')) {
                  return { passed: false, error: 'La variable value debe ser pública' };
                }
                return { passed: true };
              } catch (error) {
                return { passed: false, error: error.message };
              }
            }
          `
        }
      ],
      startingCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MyFirstContract {
    // Your code here
}`,
      difficulty: 'beginner',
      category: 'basics',
      hints: ['Start by declaring a state variable']
    },
    security: {
      startingCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SecurityBasics {
    // Implement basic security checks
}`,
      difficulty: 'beginner',
      category: 'security_basics'
    },
    // ... templates para otras áreas
  };

  return baseTemplates[area] || baseTemplates.solidity;
}; 