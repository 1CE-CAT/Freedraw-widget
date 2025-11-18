import React, { useCallback, useState } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  type Connection,
  type Edge,
  type Node,
  type NodeTypes,
} from 'reactflow';
import App from './App.tsx';
import 'reactflow/dist/style.css';

const nodeTypes: NodeTypes = {
  drawing: App,
};

const initialNodes: Node[] = [];

const initialEdges: Edge[] = [];

const Board: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [nodeIdCounter, setNodeIdCounter] = useState(1);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const addDrawingNode = useCallback(() => {
    const newNode: Node = {
      id: `drawing-${nodeIdCounter}`,
      type: 'drawing',
      position: { 
        x: Math.random() * 400, 
        y: Math.random() * 400  
      },
      data: { 
        locked: false,
        onLockToggle: (locked: boolean) => {
          setNodes((nds) =>
            nds.map((node) => {
              if (node.id === `drawing-${nodeIdCounter}`) {
                return {
                  ...node,
                  draggable: !locked,
                };
              }
              return node;
            })
          );
        }
      },
      draggable: true,
    };

    setNodes((nds) => nds.concat(newNode));
    setNodeIdCounter((counter) => counter + 1);
  }, [nodeIdCounter, setNodes]);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <button 
        onClick={addDrawingNode}
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          zIndex: 1000,
          padding: '10px',
          background: '#fff',
          border: '1px solid #ccc',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Добавить Drawing виджет
      </button>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
      >
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
};

export default Board;