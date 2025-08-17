import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import { Mesh, Vector3, Raycaster, Camera } from 'three';

interface Poster {
  id: string;
  x: number;
  y: number;
  z: number;
  width: number;
  height: number;
  isDragging: boolean;
  onWall: 'front' | 'side';
}

interface Canvas3DProps {
  posters: Poster[];
  wallColor: string;
  posterColor: string;
  onPosterUpdate: (updater: (prev: Poster[]) => Poster[]) => void;
  draggedPoster: string | null;
  onMouseDown: (posterId: string) => void;
  onMouseUp: () => void;
}

function Wall({ color, position, rotation, scale }: {
  color: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
}) {
  return (
    <mesh position={position} rotation={rotation} scale={scale}>
      <planeGeometry args={[8, 6]} />
      <meshLambertMaterial color={color} />
    </mesh>
  );
}

function DraggablePoster({ poster, color, onMouseDown, onPosterUpdate }: {
  poster: Poster;
  color: string;
  onMouseDown: (posterId: string) => void;
  onPosterUpdate: (updater: (prev: Poster[]) => Poster[]) => void;
}) {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const { camera, raycaster, mouse } = useThree();

  useFrame(() => {
    if (meshRef.current && poster.isDragging) {
      meshRef.current.scale.setScalar(1.05);
    } else if (meshRef.current) {
      meshRef.current.scale.setScalar(1);
    }
  });

  // Calculate wall position and rotation
  const wallPosition: [number, number, number] = poster.onWall === 'front'
    ? [poster.x / 100, poster.y / 100, poster.z / 100 + 0.01]
    : [poster.x / 100 + 0.01, poster.y / 100, poster.z / 100];

  const wallRotation: [number, number, number] = poster.onWall === 'front'
    ? [0, 0, 0]
    : [0, Math.PI / 2, 0];

  const handlePointerMove = (e: any) => {
    if (poster.isDragging) {
      e.stopPropagation();
      
      // Calculate new position based on mouse movement
      const newX = poster.x + e.movementX * 2;
      const newY = poster.y - e.movementY * 2;
      
      // Constrain to wall bounds
      const constrainedX = Math.max(-300, Math.min(300, newX));
      const constrainedY = Math.max(-200, Math.min(200, newY));
      
      onPosterUpdate((prev: Poster[]) => prev.map(p => 
        p.id === poster.id 
          ? { ...p, x: constrainedX, y: constrainedY }
          : p
      ));
    }
  };

  return (
    <mesh
      ref={meshRef}
      position={wallPosition}
      rotation={wallRotation}
      onPointerDown={(e) => {
        e.stopPropagation();
        onMouseDown(poster.id);
      }}
      onPointerMove={handlePointerMove}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <planeGeometry args={[poster.width / 100, poster.height / 100]} />
      <meshLambertMaterial 
        color={hovered ? '#555555' : color}
        transparent
        opacity={poster.isDragging ? 0.8 : 1}
      />
      <mesh position={[0, 0, 0.001]}>
        <planeGeometry args={[poster.width / 100 * 0.8, poster.height / 100 * 0.8]} />
        <meshLambertMaterial color="#f0f0f0" />
      </mesh>
      
      {/* Distance indicators when dragging */}
      {poster.isDragging && (
        <>
          <Text
            position={[-2, 0, 0.1]}
            fontSize={0.1}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
          >
            {Math.round(Math.abs(poster.x) / 10)}cm
          </Text>
          <Text
            position={[0, -1, 0.1]}
            fontSize={0.1}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
          >
            {Math.round(Math.abs(poster.y) / 10)}cm
          </Text>
        </>
      )}
    </mesh>
  );
}

function DistanceIndicator({ position, distance }: {
  position: [number, number, number];
  distance: number;
}) {
  return (
    <Text
      position={position}
      fontSize={0.15}
      color="#ffffff"
      anchorX="center"
      anchorY="middle"
    >
      {distance}cm
    </Text>
  );
}

function Scene({ posters, wallColor, posterColor, onPosterUpdate, draggedPoster, onMouseDown, onMouseUp }: Canvas3DProps) {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <pointLight position={[-10, 0, 5]} intensity={0.5} />

      {/* Walls */}
      {/* Front wall */}
      <Wall color={wallColor} position={[0, 0, -3]} />
      {/* Side wall */}
      <Wall color={wallColor} position={[-4, 0, 1]} rotation={[0, Math.PI / 2, 0]} />
      
      {/* Corner divider line */}
      <mesh position={[-4, 0, -3]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.005, 0.005, 6]} />
        <meshBasicMaterial color="#000000" />
      </mesh>

      {/* Posters */}
      {posters.map((poster) => (
        <DraggablePoster
          key={poster.id}
          poster={poster}
          color={posterColor}
          onMouseDown={onMouseDown}
          onPosterUpdate={onPosterUpdate}
        />
      ))}

      {/* Distance indicators for dragged poster */}
      {draggedPoster && posters.find(p => p.id === draggedPoster) && (
        <>
          {/* Show distance indicators for the dragged poster */}
        </>
      )}

      <OrbitControls 
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        maxPolarAngle={Math.PI / 2}
        minDistance={3}
        maxDistance={15}
      />
    </>
  );
}

export default function Canvas3D(props: Canvas3DProps) {
  const handlePointerUp = () => {
    props.onMouseUp();
  };

  return (
    <div 
      className="w-full h-[600px] bg-gray-900 rounded-lg overflow-hidden touch-none"
      style={{ touchAction: 'none' }}
    >
      <Canvas
        shadows
        camera={{ position: [5, 3, 8], fov: 60 }}
        onPointerUp={handlePointerUp}
        onPointerMissed={handlePointerUp}
      >
        <Scene {...props} />
      </Canvas>
    </div>
  );
}