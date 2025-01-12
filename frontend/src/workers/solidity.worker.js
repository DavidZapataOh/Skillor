import * as solc from 'solc';

self.onmessage = async function(e) {
  const { source, version } = e.data;
  
  try {
    const input = {
      language: 'Solidity',
      sources: {
        'contract.sol': {
          content: source
        }
      },
      settings: {
        outputSelection: {
          '*': {
            '*': ['*']
          }
        }
      }
    };

    const output = JSON.parse(solc.compile(JSON.stringify(input)));
    self.postMessage({ result: output });
  } catch (error) {
    self.postMessage({ error: error.message });
  }
}; 