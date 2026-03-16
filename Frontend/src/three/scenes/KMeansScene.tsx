import React, { memo } from 'react';
import { Sphere } from '@react-three/drei';
import { SimulationStep } from '../../algorithms/types';

interface KMeansSceneProps {
  step: SimulationStep;
}

const clusterColors = ['#6366f1', '#14b8a6', '#f59e0b', '#ef4444', '#22c55e', '#a855f7'];

const KMeansScene: React.FC<KMeansSceneProps> = ({ step }) => {
  return (
    <>
      {step.points.map((point) => (
        <Sphere key={point.id} position={[point.x, point.y, point.z]} args={[0.08, 12, 12]}>
          <meshStandardMaterial color={clusterColors[(point.cluster ?? 0 + 6) % clusterColors.length]} />
        </Sphere>
      ))}
      {step.centroids?.map((centroid, index) => (
        <Sphere key={`centroid-${index}`} position={[centroid.x, centroid.y, centroid.z]} args={[0.2, 20, 20]}>
          <meshStandardMaterial color={clusterColors[index % clusterColors.length]} emissive="#ffffff" emissiveIntensity={0.2} />
        </Sphere>
      ))}
    </>
  );
};

export default memo(KMeansScene);
