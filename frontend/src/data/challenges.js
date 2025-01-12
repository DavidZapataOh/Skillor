export const challenges = [
  {
    id: 1,
    title: "Basic Token Implementation",
    description: "Create a custom ERC20 token with specific access control features and burning capabilities.",
    theory: `
      <div class="space-y-4">
        <div>
          <h3 class="text-lg font-medium mb-2">What is an ERC20 Token?</h3>
          <p>An ERC20 token is an Ethereum standard that defines how to create fungible tokens. These tokens have the following main characteristics:</p>
          <ul class="list-disc list-inside mt-2 space-y-1">
            <li>Token name and symbol</li>
            <li>Total number of decimals</li>
            <li>Transfer and approval functions</li>
          </ul>
        </div>

        <div>
          <h3 class="text-lg font-medium mb-2">Access Control</h3>
          <p>For this challenge, you'll need to implement a role system using OpenZeppelin's access control pattern. This will allow you to:</p>
          <ul class="list-disc list-inside mt-2 space-y-1">
            <li>Define specific roles (e.g., MINTER_ROLE)</li>
            <li>Grant and revoke roles</li>
            <li>Restrict functions to specific roles</li>
          </ul>
        </div>
      </div>
    `,
    example: `// Basic implementation example
contract MyToken is AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    
    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
    }
    
    function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) {
        _mint(to, amount);
    }
}`,
    requirements: [
      "Implement basic ERC20 functions (transfer, balanceOf, approve)",
      "Add role system using AccessControl",
      "Create a mint function restricted to MINTER_ROLE",
      "Implement a burn function that only token owners can use",
      "Emit appropriate events for all main actions"
    ],
    tests: [
      {
        name: "Token Initialization",
        description: "Verifies the token is initialized with correct name, symbol and decimals",
        testCode: `
describe("Token Initialization", function() {
  it("Should initialize with correct values", async function() {
    const token = await Token.deploy();
    expect(await token.name()).to.equal("MyToken");
    expect(await token.symbol()).to.equal("MTK");
    expect(await token.decimals()).to.equal(18);
  });
});`,
      },
      {
        name: "Minting Functionality",
        description: "Tests if minting is restricted to MINTER_ROLE and mints correct amount",
        testCode: `
describe("Minting", function() {
  it("Should mint tokens only with MINTER_ROLE", async function() {
    const [owner, user] = await ethers.getSigners();
    const token = await Token.deploy();
    
    await token.connect(owner).mint(user.address, 100);
    expect(await token.balanceOf(user.address)).to.equal(100);
    
    await expect(
      token.connect(user).mint(user.address, 100)
    ).to.be.revertedWith("AccessControl: account missing role");
  });
});`,
      }
    ],
    startingCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MyToken {
    // Implement your token here
}`,
    area: 'solidity'
  },
  {
    id: 2,
    title: "Secure Vault Contract",
    description: "Develop a secure vault contract with time locks",
    requirements: [
      "Implement time-based withdrawal restrictions",
      "Add emergency withdrawal mechanism",
      "Include multi-signature approval system",
      "Protect against reentrancy attacks"
    ],
    testInstructions: "Tests will verify security measures, time locks, and proper access controls.",
    area: 'security'
  }
]; 