export class CompilerService {
  constructor() {
    this.worker = new Worker(
      new URL('../workers/solidity.worker.js', import.meta.url)
    );
  }

  compile(source) {
    return new Promise((resolve, reject) => {
      this.worker.onmessage = (e) => {
        if (e.data.error) {
          reject(new Error(e.data.error));
        } else {
          resolve(e.data.result);
        }
      };

      this.worker.postMessage({ source });
    });
  }
} 