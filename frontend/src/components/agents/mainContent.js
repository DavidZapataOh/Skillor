'use client';

const agents = [
  {
    name: "Vitalik Butterbean",
    role: "Solidity Expert",
    image: "/agents/vitalik.jpg",
    available: true,
    description: "Expert in smart contracts and Solidity development. Specialized in gas optimization and secure design patterns."
  },
  {
    name: "Johnny Clock",
    role: "Cybersecurity Expert",
    image: "/agents/johnny.jpg",
    available: false,
    description: "Specialist in smart contract auditing and blockchain security."
  },
  {
    name: "Eli Bean-Salsa",
    role: "Zero Knowledge Expert",
    image: "/agents/eli.jpg",
    available: false,
    description: "Master in ZK-Proofs and blockchain privacy."
  },
  {
    name: "Jim Rose",
    role: "Mode Expert",
    image: "/agents/jim.jpg",
    available: false,
    description: "Specialist in Mode Network development and optimization."
  }
];

export default function MainContent() {
  return (
    <div className="p-8 ml-64">
      <h1 className="text-3xl font-bold text-text mb-8">
        Specialized Agents
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent, index) => (
          <div 
            key={index}
            className="relative bg-background rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border-1 border-muted"
          >
            <div className="aspect-square">
              <img
                src={agent.image}
                alt={agent.name}
                className="object-cover w-full h-full"
              />
            </div>
            
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-text">
                    {agent.name}
                  </h3>
                  <p className="text-sm text-textSecondary">
                    {agent.role}
                  </p>
                </div>
                {agent.available ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/20 text-primary">
                    Available
                  </span>
                ) : (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-background text-textSecondary border-1 border-muted">
                    Coming Soon
                  </span>
                )}
              </div>
              
              <p className="text-textSecondary text-sm">
                {agent.description}
              </p>
              
              {agent.available && (
                <button className="mt-4 w-full bg-primary hover:bg-secondary text-text font-medium py-2 px-4 rounded-lg transition-colors duration-300">
                  Start Chat
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}