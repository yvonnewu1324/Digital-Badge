import { useState, useEffect, useRef, useCallback } from 'react';
import { CardStyle } from '../types';
import { useDeviceOrientation } from './useDeviceOrientation';

/**
 * Hook to handle 3D card effects with mouse and gyroscope
 */
export const useCard3D = () => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<CardStyle>({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 });
  
  const targetStyle = useRef<CardStyle>({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 });
  const requestRef = useRef<number>(0);
  const calibrationRef = useRef<{ beta: number | null; gamma: number | null; calibrated: boolean }>({ 
    beta: null, 
    gamma: null, 
    calibrated: false 
  });

  const lerp = (start: number, end: number, factor: number) => {
    return start + (end - start) * factor;
  };

  const updatePhysics = useCallback(() => {
    // More responsive lerp for iframe-like direct rotation
    setStyle(prev => ({
      rotateX: lerp(prev.rotateX, targetStyle.current.rotateX, 0.2),
      rotateY: lerp(prev.rotateY, targetStyle.current.rotateY, 0.2),
      glareX: lerp(prev.glareX, targetStyle.current.glareX, 0.2),
      glareY: lerp(prev.glareY, targetStyle.current.glareY, 0.2),
    }));
    requestRef.current = requestAnimationFrame(updatePhysics);
  }, []);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(updatePhysics);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [updatePhysics]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Enhanced rotation for iframe-like 3D effect - more responsive
    const maxRotation = 40; // Increased for more dramatic effect like iframe
    const rotationIntensity = 15; // Increased for more responsive feel
    let rotateY = ((x - centerX) / centerX) * rotationIntensity; 
    let rotateX = ((y - centerY) / centerY) * -rotationIntensity;
    
    // Clamp rotations to prevent flipping to the back
    rotateY = Math.max(-maxRotation, Math.min(maxRotation, rotateY));
    rotateX = Math.max(-maxRotation, Math.min(maxRotation, rotateX));

    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    targetStyle.current = { rotateX, rotateY, glareX, glareY };
  }, []);

  const handleMouseLeave = useCallback(() => {
    targetStyle.current = { rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 };
  }, []);

  // Get the global device orientation listener
  const { addListener } = useDeviceOrientation();

  // Gyroscope Handler - Direct mapping for iframe-like 3D effect with calibration
  const handleOrientation = useCallback((event: DeviceOrientationEvent) => {
    let { beta, gamma } = event;
    if (beta === null || gamma === null) return;

    // Calibrate on first reading - store initial orientation as baseline
    if (!calibrationRef.current.calibrated) {
      calibrationRef.current.beta = beta;
      calibrationRef.current.gamma = gamma;
      calibrationRef.current.calibrated = true;
      return; // Skip first reading to establish baseline
    }

    // Subtract calibration values to make card appear flat when held normally
    const calibratedBeta = beta - (calibrationRef.current.beta || 0);
    const calibratedGamma = gamma - (calibrationRef.current.gamma || 0);

    // Clamp to prevent excessive rotation that would show the back
    const maxRotation = 45; // Increased for more dramatic effect like iframe
    let adjustedBeta = calibratedBeta;
    let adjustedGamma = calibratedGamma;
    
    if (adjustedBeta > maxRotation) adjustedBeta = maxRotation;
    if (adjustedBeta < -maxRotation) adjustedBeta = -maxRotation;
    if (adjustedGamma > maxRotation) adjustedGamma = maxRotation;
    if (adjustedGamma < -maxRotation) adjustedGamma = -maxRotation;

    // More direct mapping for responsive 3D effect (like iframe)
    // Scale factor for sensitivity (0.8 gives smooth but responsive feel)
    const sensitivity = 0.8;
    
    targetStyle.current = {
      rotateX: -adjustedBeta * sensitivity,
      rotateY: adjustedGamma * sensitivity,
      // Dynamic glare based on orientation
      glareX: 50 + (adjustedGamma * 1),
      glareY: 50 + (adjustedBeta * 1),
    };
  }, []);

  useEffect(() => {
    // Subscribe to the global device orientation listener
    const unsubscribe = addListener(handleOrientation);
    
    return () => {
      unsubscribe();
    };
  }, [addListener, handleOrientation]);

  return {
    cardRef,
    style,
    handleMouseMove,
    handleMouseLeave,
  };
};
