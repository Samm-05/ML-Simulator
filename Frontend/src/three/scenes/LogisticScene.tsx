import React, { memo } from 'react';
import { Line, Sphere } from '@react-three/drei';
import { SimulationStep } from '../../algorithms/types';

interface LogisticSceneProps {
  step: SimulationStep;
}

const LogisticScene: React.FC<LogisticSceneProps> = ({ step }) => {
  return (
    <>
      {step.points.map((point) => (
        <Sphere key={point.id} position={[point.x, point.y, point.z]} args={[0.09, 12, 12]}>
          <meshStandardMaterial color={point.label === 1 ? '#ef4444' : '#22c55e'} />
        </Sphere>
      ))}
      {step.regressionLine && (
        <Line points={[step.regressionLine.start, step.regressionLine.end]} color="#6366f1" lineWidth={2} />
      )}
    </>
  );
};

export default memo(LogisticScene);
