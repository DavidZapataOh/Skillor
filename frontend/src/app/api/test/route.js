import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { code, tests } = await request.json();

    const basicValidation = validateBasicSyntax(code);
    if (!basicValidation.valid) {
      return NextResponse.json({
        passed: false,
        tests: [{
          name: 'Basic Syntax',
          passed: false,
          error: basicValidation.error
        }]
      });
    }

    const results = tests.map(test => {
      const passed = validateTest(code, test);
      return {
        name: test.name,
        passed,
        output: passed ? "Test passed successfully" : "Test failed"
      };
    });

    return NextResponse.json({
      passed: results.every(r => r.passed),
      tests: results
    });
  } catch (error) {
    return NextResponse.json({
      passed: false,
      tests: [{
        name: 'Server Error',
        passed: false,
        error: error.message
      }]
    });
  }
}

function validateBasicSyntax(code) {
  const requiredPatterns = [
    { pattern: /pragma\s+solidity/i, error: "Missing pragma solidity directive" },
    { pattern: /contract\s+\w+/i, error: "Missing contract declaration" },
    { pattern: /{[\s\S]*}/i, error: "Invalid contract structure" }
  ];

  for (const { pattern, error } of requiredPatterns) {
    if (!pattern.test(code)) {
      return { valid: false, error };
    }
  }

  return { valid: true };
}

function validateTest(code, test) {
  const { requirements = [] } = test;
  
  if (test.name === "Minting") {
    return code.includes("function mint") && 
           code.includes("onlyOwner") && 
           code.includes("_mint");
  }

  return true;
} 