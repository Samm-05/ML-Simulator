import React, { memo } from 'react';
import { Line, Sphere } from '@react-three/drei';
import { SimulationStep } from '../../algorithms/types';

interface DecisionTreeSceneProps {
  step: SimulationStep;
}

const DecisionTreeScene: React.FC<DecisionTreeSceneProps> = ({ step }) => {
  const nodeMap = new Map((step.treeNodes ?? []).map((node) => [node.id, node]));
  return (
    <>
      {(step.treeEdges ?? []).map((edge, idx) => {
        const from = nodeMap.get(edge.from);
        const to = nodeMap.get(edge.to);
        if (!from || !to) {
          return null;
        }
        return <Line key={`edge-${idx}`} points={[[from.x, from.y, 0], [to.x, to.y, 0]]} color="#94a3b8" />;
      })}
      {(step.treeNodes ?? []).map((node) => (
        <Sphere key={node.id} position={[node.x, node.y, 0]} args={[0.2, 16, 16]}>
          <meshStandardMaterial color={node.highlighted ? '#6366f1' : node.leaf ? '#14b8a6' : '#f59e0b'} />
        </Sphere>
      ))}
    </>
  );
};

export default memo(DecisionTreeScene);
