import { languages } from 'monaco-editor';

const elementaryTypes = [
  'address', 'address payable', 'bool', 'string', 'bytes', 'byte',
  'int', 'int8', 'int16', 'int24', 'int32', 'int40', 'int48', 'int56', 'int64', 'int72', 'int80', 'int88', 'int96', 'int104', 'int112', 'int120', 'int128', 'int136', 'int144', 'int152', 'int160', 'int168', 'int176', 'int184', 'int192', 'int200', 'int208', 'int216', 'int224', 'int232', 'int240', 'int248', 'int256',
  'uint', 'uint8', 'uint16', 'uint24', 'uint32', 'uint40', 'uint48', 'uint56', 'uint64', 'uint72', 'uint80', 'uint88', 'uint96', 'uint104', 'uint112', 'uint120', 'uint128', 'uint136', 'uint144', 'uint152', 'uint160', 'uint168', 'uint176', 'uint184', 'uint192', 'uint200', 'uint208', 'uint216', 'uint224', 'uint232', 'uint240', 'uint248', 'uint256',
  'fixed', 'ufixed'
].map(type => ({
  label: type,
  kind: languages.CompletionItemKind.Keyword,
  insertText: type
}));

const units = [
  'wei', 'gwei', 'ether',
  'seconds', 'minutes', 'hours', 'days', 'weeks', 'years'
].map(unit => ({
  label: unit,
  kind: languages.CompletionItemKind.Unit,
  insertText: unit
}));

const keywords = [
  'pragma', 'solidity', 'contract', 'interface', 'library', 'abstract',
  'function', 'modifier', 'event', 'struct', 'enum', 'mapping',
  'public', 'private', 'internal', 'external', 'pure', 'view', 'payable',
  'virtual', 'override', 'returns', 'memory', 'storage', 'calldata',
  'constant', 'immutable', 'indexed', 'anonymous', 'constructor',
  'if', 'else', 'for', 'while', 'do', 'break', 'continue', 'return',
  'try', 'catch', 'revert', 'require', 'assert', 'emit', 'delete',
  'new', 'is', 'this', 'super', 'selfdestruct', 'receive', 'fallback',
  'using', 'assembly', 'let', 'case', 'switch', 'default', 'unchecked'
].map(keyword => ({
  label: keyword,
  kind: languages.CompletionItemKind.Keyword,
  insertText: keyword
}));

const snippets = [
  {
    label: 'contract',
    kind: languages.CompletionItemKind.Snippet,
    insertText: 'contract ${1:Name} {\n\t$0\n}',
    documentation: 'Contract template'
  },
  {
    label: 'interface',
    kind: languages.CompletionItemKind.Snippet,
    insertText: 'interface ${1:IName} {\n\t$0\n}',
    documentation: 'Interface template'
  },
  {
    label: 'library',
    kind: languages.CompletionItemKind.Snippet,
    insertText: 'library ${1:Name} {\n\t$0\n}',
    documentation: 'Library template'
  },
  {
    label: 'function',
    kind: languages.CompletionItemKind.Snippet,
    insertText: 'function ${1:name}(${2:params}) ${3|public,private,internal,external|} ${4|pure,view,payable|} ${5:virtual} returns (${6:type}) {\n\t$0\n}',
    documentation: 'Function declaration'
  },
  {
    label: 'event',
    kind: languages.CompletionItemKind.Snippet,
    insertText: 'event ${1:Name}(${2:params});',
    documentation: 'Event declaration'
  },
  {
    label: 'modifier',
    kind: languages.CompletionItemKind.Snippet,
    insertText: 'modifier ${1:name}() {\n\t_;\n}',
    documentation: 'Modifier declaration'
  },
  {
    label: 'struct',
    kind: languages.CompletionItemKind.Snippet,
    insertText: 'struct ${1:Name} {\n\t$0\n}',
    documentation: 'Struct declaration'
  },
  {
    label: 'enum',
    kind: languages.CompletionItemKind.Snippet,
    insertText: 'enum ${1:Name} {\n\t$0\n}',
    documentation: 'Enum declaration'
  },
  {
    label: 'mapping',
    kind: languages.CompletionItemKind.Snippet,
    insertText: 'mapping(${1:keyType} => ${2:valueType})',
    documentation: 'Mapping declaration'
  },
  {
    label: 'try-catch',
    kind: languages.CompletionItemKind.Snippet,
    insertText: 'try ${1:expression} returns (${2:type} ${3:variable}) {\n\t$4\n} catch ${5:Error}(string memory ${6:reason}) {\n\t$7\n}',
    documentation: 'Try-catch block'
  }
];

const globals = [
  {
    label: 'msg',
    kind: languages.CompletionItemKind.Variable,
    insertText: 'msg',
    documentation: 'Current message object'
  },
  {
    label: 'msg.sender',
    kind: languages.CompletionItemKind.Property,
    insertText: 'msg.sender',
    documentation: 'Address of the message sender'
  },
  {
    label: 'msg.value',
    kind: languages.CompletionItemKind.Property,
    insertText: 'msg.value',
    documentation: 'Amount of wei sent with the message'
  },
  {
    label: 'msg.data',
    kind: languages.CompletionItemKind.Property,
    insertText: 'msg.data',
    documentation: 'Complete calldata'
  },
  {
    label: 'msg.sig',
    kind: languages.CompletionItemKind.Property,
    insertText: 'msg.sig',
    documentation: 'First four bytes of the calldata (function identifier)'
  },

  {
    label: 'block',
    kind: languages.CompletionItemKind.Variable,
    insertText: 'block',
    documentation: 'Current block object'
  },
  {
    label: 'block.basefee',
    kind: languages.CompletionItemKind.Property,
    insertText: 'block.basefee',
    documentation: 'Current block\'s base fee (EIP-1559)'
  },
  {
    label: 'block.chainid',
    kind: languages.CompletionItemKind.Property,
    insertText: 'block.chainid',
    documentation: 'Current chain ID'
  },
  {
    label: 'block.coinbase',
    kind: languages.CompletionItemKind.Property,
    insertText: 'block.coinbase',
    documentation: 'Current block miners address'
  },
  {
    label: 'block.difficulty',
    kind: languages.CompletionItemKind.Property,
    insertText: 'block.difficulty',
    documentation: 'Current block difficulty'
  },
  {
    label: 'block.gaslimit',
    kind: languages.CompletionItemKind.Property,
    insertText: 'block.gaslimit',
    documentation: 'Current block gaslimit'
  },
  {
    label: 'block.number',
    kind: languages.CompletionItemKind.Property,
    insertText: 'block.number',
    documentation: 'Current block number'
  },
  {
    label: 'block.timestamp',
    kind: languages.CompletionItemKind.Property,
    insertText: 'block.timestamp',
    documentation: 'Current block timestamp in seconds since unix epoch'
  },

  {
    label: 'tx',
    kind: languages.CompletionItemKind.Variable,
    insertText: 'tx',
    documentation: 'Transaction object'
  },
  {
    label: 'tx.gasprice',
    kind: languages.CompletionItemKind.Property,
    insertText: 'tx.gasprice',
    documentation: 'Transactions gas price'
  },
  {
    label: 'tx.origin',
    kind: languages.CompletionItemKind.Property,
    insertText: 'tx.origin',
    documentation: 'Sender of the transaction (full call chain)'
  },

  {
    label: 'require',
    kind: languages.CompletionItemKind.Function,
    insertText: 'require(${1:condition}, "${2:message}");',
    documentation: 'Condition check that reverts on failure'
  },
  {
    label: 'assert',
    kind: languages.CompletionItemKind.Function,
    insertText: 'assert(${1:condition});',
    documentation: 'Condition check for invariants'
  },
  {
    label: 'revert',
    kind: languages.CompletionItemKind.Function,
    insertText: 'revert("${1:message}");',
    documentation: 'Revert with message'
  },
  {
    label: 'keccak256',
    kind: languages.CompletionItemKind.Function,
    insertText: 'keccak256(${1:bytes});',
    documentation: 'Compute Keccak-256 hash'
  },
  {
    label: 'sha256',
    kind: languages.CompletionItemKind.Function,
    insertText: 'sha256(${1:bytes});',
    documentation: 'Compute SHA-256 hash'
  },
  {
    label: 'ripemd160',
    kind: languages.CompletionItemKind.Function,
    insertText: 'ripemd160(${1:bytes});',
    documentation: 'Compute RIPEMD-160 hash'
  },
  {
    label: 'ecrecover',
    kind: languages.CompletionItemKind.Function,
    insertText: 'ecrecover(${1:bytes32 hash}, ${2:uint8 v}, ${3:bytes32 r}, ${4:bytes32 s});',
    documentation: 'Recover address from signature'
  },
  {
    label: 'addmod',
    kind: languages.CompletionItemKind.Function,
    insertText: 'addmod(${1:uint x}, ${2:uint y}, ${3:uint k});',
    documentation: 'Compute (x + y) % k'
  },
  {
    label: 'mulmod',
    kind: languages.CompletionItemKind.Function,
    insertText: 'mulmod(${1:uint x}, ${2:uint y}, ${3:uint k});',
    documentation: 'Compute (x * y) % k'
  },
  {
    label: 'selfdestruct',
    kind: languages.CompletionItemKind.Function,
    insertText: 'selfdestruct(${1:address payable recipient});',
    documentation: 'Destroy contract and send funds'
  }
];

const assemblyItems = [
  'stop', 'add', 'sub', 'mul', 'div', 'sdiv', 'mod', 'smod', 'exp', 'not',
  'lt', 'gt', 'slt', 'sgt', 'eq', 'iszero', 'and', 'or', 'xor', 'byte',
  'shl', 'shr', 'sar', 'addmod', 'mulmod', 'signextend', 'keccak256',
  'pop', 'mload', 'mstore', 'mstore8', 'sload', 'sstore', 'msize',
  'gas', 'address', 'balance', 'selfbalance', 'caller', 'callvalue',
  'calldataload', 'calldatasize', 'calldatacopy', 'codesize', 'codecopy',
  'extcodesize', 'extcodecopy', 'returndatasize', 'returndatacopy',
  'extcodehash', 'create', 'create2', 'call', 'callcode', 'delegatecall',
  'staticcall', 'return', 'revert', 'selfdestruct', 'invalid',
  'log0', 'log1', 'log2', 'log3', 'log4',
  'chainid', 'basefee', 'origin', 'gasprice', 'blockhash',
  'coinbase', 'timestamp', 'number', 'difficulty', 'gaslimit'
].map(opcode => ({
  label: opcode,
  kind: languages.CompletionItemKind.Keyword,
  insertText: opcode,
  documentation: `Assembly opcode: ${opcode}`
}));

const basicSolidityLanguage = {
  defaultToken: '',
  tokenPostfix: '.sol',
  keywords: Array.from(new Set([
    ...keywords.map(k => k.label),
    ...elementaryTypes.map(t => t.label),
    ...units.map(u => u.label)
  ])),
  
  operators: [
    '=', '>', '<', '!', '~', '?', ':',
    '==', '<=', '>=', '!=', '&&', '||', '++', '--',
    '+', '-', '*', '/', '&', '|', '^', '%', '<<',
    '>>', '>>>', '+=', '-=', '*=', '/=', '&=', '|=',
    '^=', '%=', '<<=', '>>=', '>>>='
  ],

  symbols: /[=><!~?:&|+\-*\/\^%]+/,
  
  brackets: [
    ['{', '}', 'delimiter.curly'],
    ['[', ']', 'delimiter.square'],
    ['(', ')', 'delimiter.parenthesis']
  ],

  tokenizer: {
    root: [
      [/\/\/.*$/, 'comment.line'],
      [/\/\*/, 'comment.block', '@comment'],
      [/[a-zA-Z_]\w*/, { cases: { '@keywords': 'keyword', '@default': 'identifier' }}],
      [/[{}]/, { token: 'delimiter.curly' }],
      [/[\[\]]/, { token: 'delimiter.square' }],
      [/[()]/, { token: 'delimiter.parenthesis' }],
      [/@symbols/, { cases: { '@operators': 'operator', '@default': '' }}],
      [/\d*\.\d+([eE][\-+]?\d+)?/, 'number.float'],
      [/0[xX][0-9a-fA-F]+/, 'number.hex'],
      [/\d+/, 'number'],
      [/"([^"\\]|\\.)*$/, 'string.invalid'],
      [/'([^'\\]|\\.)*$/, 'string.invalid'],
      [/"/, 'string', '@string_double'],
      [/'/, 'string', '@string_single'],
      [/[;,.]/, 'delimiter']
    ],

    comment: [
      [/[^/*]+/, 'comment.block'],
      [/\*\//, 'comment.block', '@pop'],
      [/[/*]/, 'comment.block']
    ],

    string_double: [
      [/[^\\"]+/, 'string'],
      [/\\./, 'string.escape'],
      [/"/, 'string', '@pop']
    ],

    string_single: [
      [/[^\\']+/, 'string'],
      [/\\./, 'string.escape'],
      [/'/, 'string', '@pop']
    ]
  }
};

export const solidityConfig = {
  language: basicSolidityLanguage,
  completionItems: [
    ...keywords,
    ...elementaryTypes,
    ...units,
    ...snippets,
    ...globals,
    ...assemblyItems
  ]
};

export const editorOptions = {
  minimap: { enabled: false },
  fontSize: 14,
  suggestOnTriggerCharacters: true,
  snippetSuggestions: 'inline',
  suggest: {
    snippetsPreventQuickSuggestions: false,
  },
  wordBasedSuggestions: true,
  quickSuggestions: true,
  bracketPairColorization: {
    enabled: true,
    independentColorPoolPerBracketType: true
  },
  guides: {
    bracketPairs: true,
    indentation: true
  }
};

export const editorTheme = {
  base: 'vs-dark',
  inherit: true,
  rules: [
    { token: 'delimiter.curly', foreground: 'FFD700' },    // Dorado
    { token: 'delimiter.square', foreground: 'DA70D6' },   // Violeta
    { token: 'delimiter.parenthesis', foreground: '87CEFA' }, // Azul claro
    { token: 'comment.line', foreground: '608B4E' },
    { token: 'comment.block', foreground: '608B4E' },
    { token: 'string', foreground: 'CE9178' },
    { token: 'string.escape', foreground: 'D7BA7D' },
    { token: 'keyword', foreground: '569CD6' },
    { token: 'number', foreground: 'B5CEA8' }
  ],
  colors: {
    'editor.background': '#1E1E1E',
    'editor.foreground': '#D4D4D4',
    'editorBracketMatch.background': '#0D3A58',
    'editorBracketMatch.border': '#888888'
  }
};

