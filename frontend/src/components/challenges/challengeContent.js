'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import { motion } from "framer-motion";
import { challenges } from '@/data/challenges';
import { TestService } from '@/services/testService';
import Editor from '@monaco-editor/react';
import { solidityConfig, editorTheme, editorOptions } from '@/config/monaco';

export default function ChallengeContent() {
  const params = useParams();
  const [code, setCode] = useState('');
  const [testResults, setTestResults] = useState(null);
  
  const challenge = challenges.find(c => c.id === parseInt(params.id));

  const runTests = async () => {
    try {
      const validation = await TestService.validateCode(code);
      
      if (!validation.valid) {
        setTestResults({
          passed: false,
          tests: [{
            name: 'Validation Error',
            passed: false,
            error: validation.error
          }]
        });
        return;
      }

      const results = await TestService.runTests(code, challenge.tests);
      setTestResults({
        passed: results.every(r => r.passed),
        tests: results
      });
    } catch (error) {
      console.error('Error running tests:', error);
      setTestResults({
        passed: false,
        tests: [{
          name: 'Execution Error',
          passed: false,
          error: error.message
        }]
      });
    }
  };

  return (
    <div className="p-6 ml-64">
      <div className="flex gap-6 h-[calc(100vh-120px)]">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-[600px]"
        >
          <div className="bg-background p-6 rounded-xl border-1 border-muted h-full overflow-y-auto custom-scrollbar">
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-primary text-background px-4 py-2 rounded-lg">
                #{challenge.id}
              </div>
              <h1 className="text-text text-2xl font-bold">{challenge.title}</h1>
            </div>

            <div className="space-y-8">
              <div className="bg-background_secondary p-6 rounded-lg">
                <h2 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center text-primary">
                    📝
                  </span>
                  Description
                </h2>
                <p className="text-textSecondary leading-relaxed">
                  {challenge.description}
                </p>
              </div>

              <div className="bg-background_secondary p-6 rounded-lg">
                <h2 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center text-primary">
                    💡
                  </span>
                  Explanation
                </h2>
                <div className="space-y-4">
                  <div 
                    className="text-textSecondary prose prose-invert prose-p:leading-relaxed prose-headings:text-text prose-headings:font-semibold prose-code:text-primary prose-code:bg-primary/10 prose-code:px-1 prose-code:py-0.5 prose-code:rounded"
                    dangerouslySetInnerHTML={{ __html: challenge.theory }} 
                  />
                  <div className="mt-6 bg-background/40 p-4 rounded-lg border border-muted">
                    <h3 className="text-sm font-medium text-primary mb-2">Ejemplo:</h3>
                    <pre className="text-sm text-textSecondary overflow-x-auto">
                      {challenge.example}
                    </pre>
                  </div>
                </div>
              </div>

              <div className="bg-background_secondary p-6 rounded-lg">
                <h2 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center text-primary">
                    ✅
                  </span>
                  Requirements
                </h2>
                <ul className="space-y-3">
                  {challenge.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-3 text-textSecondary">
                      <span className="mt-1 w-5 h-5 bg-background rounded-full flex items-center justify-center text-xs font-medium text-primary border border-primary/20">
                        {i + 1}
                      </span>
                      <span className="leading-relaxed">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-1"
        >
          <div className="bg-background p-6 rounded-xl border-1 border-muted h-full flex flex-col">
            <div className="mb-6">
              <h2 className="text-text text-xl font-bold">Solution</h2>
            </div>

            <div className="flex flex-col flex-1 min-h-0">
              <div className="bg-background_secondary rounded-lg overflow-hidden h-[400px] mb-6">
                <Editor
                  height="100%"
                  defaultLanguage="solidity"
                  theme="solidity-theme"
                  value={code || challenge.startingCode}
                  onChange={setCode}
                  options={editorOptions}
                  onMount={(editor, monaco) => {
                    monaco.editor.defineTheme('solidity-theme', editorTheme);
                    monaco.editor.setTheme('solidity-theme');
                    
                    editor.updateOptions({
                      bracketPairColorization: { enabled: true },
                      bracketPairGuides: { enabled: true }
                    });

                    monaco.languages.register({ id: 'solidity' });
                    monaco.languages.setMonarchTokensProvider('solidity', solidityConfig.language);
                    monaco.languages.registerCompletionItemProvider('solidity', {
                      triggerCharacters: ['.', ' '],
                      provideCompletionItems: (model, position) => {
                        const word = model.getWordUntilPosition(position);
                        const range = {
                          startLineNumber: position.lineNumber,
                          endLineNumber: position.lineNumber,
                          startColumn: word.startColumn,
                          endColumn: word.endColumn
                        };

                        return {
                          suggestions: solidityConfig.completionItems.map(item => ({
                            ...item,
                            range,
                            insertTextRules: item.insertText?.includes('${') 
                              ? monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet 
                              : monaco.languages.CompletionItemInsertTextRule.InsertAsIs
                          }))
                        };
                      }
                    });
                  }}
                />
              </div>

              <div className="flex-1 min-h-0">
                <div className="bg-background_secondary p-4 rounded-lg flex flex-col h-full">
                  <div className="flex justify-between items-center mb-4 sticky top-0 bg-background_secondary z-10 pb-4">
                    <h2 className="text-lg font-semibold text-text">Tests</h2>
                    <button
                      onClick={runTests}
                      className="bg-primary hover:bg-primary/90 transition-colors text-background px-6 py-2 rounded-lg font-medium"
                    >
                      Run Tests
                    </button>
                  </div>

                  <div className="space-y-4 overflow-y-auto custom-scrollbar flex-1">
                    {challenge.tests.map((test, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-background/40 p-4 rounded-lg border border-muted"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium text-text">{test.name}</h3>
                          {testResults?.tests[i] && (
                            <span className={`px-2 py-1 rounded text-sm ${
                              testResults.tests[i].passed 
                                ? 'bg-green-500/20 text-green-500' 
                                : 'bg-red-500/20 text-red-500'
                            }`}>
                              {testResults.tests[i].passed ? 'Passed' : 'Failed'}
                            </span>
                          )}
                        </div>
                        <p className="text-textSecondary text-sm mb-3">{test.description}</p>
                        <div className="bg-background rounded-lg p-3">
                          <pre className="text-sm text-textSecondary overflow-x-auto">
                            <code>{test.testCode}</code>
                          </pre>
                        </div>
                        {testResults?.tests[i]?.error && (
                          <p className="mt-2 text-red-500 text-sm">{testResults.tests[i].error}</p>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 