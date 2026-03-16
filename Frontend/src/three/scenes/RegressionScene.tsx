import React, { memo } from 'react';
import { Line, Sphere } from '@react-three/drei';
import { SimulationStep } from '../../algorithms/types';

interface RegressionSceneProps {
  step: SimulationStep;
}

const RegressionScene: React.FC<RegressionSceneProps> = ({ step }) => {
  return (
    <>
      {step.points.map((point) => (
        <Sphere key={point.id} position={[point.x, point.y, point.z]} args={[0.08, 10, 10]}>
          <meshStandardMaterial color="#14b8a6" />
        </Sphere>
      ))}
      {step.regressionLine && (
        <Line points={[step.regressionLine.start, step.regressionLine.end]} color="#6366f1" lineWidth={2} />
      )}
      {step.errorSegments?.map((segment, index) => (
        <Line key={`err-${index}`} points={[segment.from, segment.to]} color="#ef4444" dashed dashSize={0.08} gapSize={0.08} />
      ))}
    </>
  );
};

export default memo(RegressionScene);
