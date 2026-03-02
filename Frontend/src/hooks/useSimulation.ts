import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  runSimulation,
  pauseSimulation,
  resetSimulation,
  updateParameter,
  nextStep,
} from '../features/simulator/simulatorSlice';
import gsap from 'gsap';

export const useSimulation = () => {
  const dispatch = useAppDispatch();
  const {
    currentAlgorithm,
    parameters,
    data,
    isRunning,
    currentStep,
    lossHistory,
  } = useAppSelector((state) => state.simulator);

  const animationRef = useRef<gsap.core.Tween>();

  useEffect(() => {
    if (isRunning) {
      // Animate simulation steps
      animationRef.current = gsap.to({}, {
        duration: 1 / parameters.animationSpeed,
        repeat: -1,
        onRepeat: () => {
          dispatch(nextStep());
        },
      });
    } else {
      animationRef.current?.kill();
    }

    return () => {
      animationRef.current?.kill();
    };
  }, [isRunning, parameters.animationSpeed, dispatch]);

  const startSimulation = () => {
    dispatch(runSimulation());
  };

  const pause = () => {
    dispatch(pauseSimulation());
  };

  const reset = () => {
    dispatch(resetSimulation());
  };

  const updateParam = (param: string, value: any) => {
    dispatch(updateParameter({ param, value }));
  };

  return {
    algorithm: currentAlgorithm,
    parameters,
    data,
    isRunning,
    currentStep,
    lossHistory,
    startSimulation,
    pause,
    reset,
    updateParam,
  };
};