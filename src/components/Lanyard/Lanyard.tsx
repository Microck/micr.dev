import { useEffect, useRef, useState } from 'react';
import { Canvas, extend, useFrame } from '@react-three/fiber';
import { useGLTF, useTexture, Environment, Lightformer } from '@react-three/drei';
import { BallCollider, CuboidCollider, Physics, RigidBody, useRopeJoint, useSphericalJoint, RapierRigidBody } from '@react-three/rapier';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';
import * as THREE from 'three';

import cardGLB from './card.glb';
import lanyard from './lanyard.png';
import './Lanyard.css';

extend({ MeshLineGeometry, MeshLineMaterial });

interface LanyardProps {
  position?: [number, number, number];
  gravity?: [number, number, number];
  fov?: number;
  transparent?: boolean;
}

export default function Lanyard({ 
  position = [0, 0, 30], 
  gravity = [0, -40, 0], 
  fov = 20, 
  transparent = true 
}: LanyardProps) {
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);

  const gravityY = gravity[1];
  const fovValue = fov;

  const light1Intensity = 2;
  const light1Pos = [0, -1, 5];
  const light2Intensity = 3;
  const light2Pos = [-1, -1, 1];
  const light3Intensity = 3;
  const light3Pos = [1, 1, 1];
  const mainLightIntensity = 10;
  const mainLightPos = [-10, 0, 14];

  const rootX = -2.3;
  const rootY = 2.2;
  const rootZ = -1.5;
  const rootScale = 1.5;

  const bandColor = '#b5b3a7';
  const cardColor = '#B5B3A7';
  const metalColor = '#2e2e2e';
  const meshRoughness = 0.5;
  const meshMetalness = 1;

  const cardJointY = 2.25;
  const segmentLength = 0.5;
  const bandWidth = 1;

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="lanyard-wrapper">
      <Canvas
        camera={{ position: position, fov: fovValue }}
        dpr={[1, isMobile ? 1.5 : 2]}
        gl={{ alpha: transparent }}
        onCreated={({ gl }) => gl.setClearColor(new THREE.Color(0x000000), transparent ? 0 : 1)}
      >
        <ambientLight intensity={Math.PI} />
        <Physics gravity={[gravity[0], gravityY, gravity[2]]} timeStep={isMobile ? 1 / 30 : 1 / 60}>
          <group position={[rootX, rootY, rootZ]} scale={rootScale}>
            <Band 
              key={`${cardJointY}-${segmentLength}`}
              isMobile={isMobile} 
              bandColor={bandColor} 
              cardColor={cardColor} 
              metalColor={metalColor}
              meshRoughness={meshRoughness}
              meshMetalness={meshMetalness}
              cardJointY={cardJointY}
              segmentLength={segmentLength}
              bandWidth={bandWidth}
            />
          </group>
        </Physics>
        <Environment blur={0.75}>
          <Lightformer intensity={light1Intensity} color="white" position={light1Pos as [number, number, number]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={light2Intensity} color="white" position={light2Pos as [number, number, number]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={light3Intensity} color="white" position={light3Pos as [number, number, number]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={mainLightIntensity} color="white" position={mainLightPos as [number, number, number]} rotation={[0, Math.PI / 2, Math.PI / 3]} scale={[100, 10, 1]} />
        </Environment>
      </Canvas>
    </div>
  );
}

interface BandProps {
  maxSpeed?: number;
  minSpeed?: number;
  isMobile?: boolean;
  bandColor?: string;
  cardColor?: string;
  metalColor?: string;
  meshRoughness?: number;
  meshMetalness?: number;
  cardJointY?: number;
  segmentLength?: number;
  bandWidth?: number;
}

function Band({ 
  maxSpeed = 50, 
  minSpeed = 0, 
  isMobile = false,
  bandColor = '#ffffff',
  cardColor = '#ffffff',
  metalColor = '#2e2e2e',
  meshRoughness = 0.9,
  meshMetalness = 0.8,
  cardJointY = 1.45,
  segmentLength = 0.5,
  bandWidth = 1
}: BandProps) {
  const band = useRef<THREE.Mesh>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fixed = useRef<RapierRigidBody>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const j1 = useRef<RapierRigidBody>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const j2 = useRef<RapierRigidBody>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const j3 = useRef<RapierRigidBody>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const card = useRef<RapierRigidBody>(null);
  
  const vec = new THREE.Vector3();
  const ang = new THREE.Vector3();
  const rot = new THREE.Vector3();
  const dir = new THREE.Vector3();
  
  const linearDamping = 4;
  const angularDamping = 4;

  const segmentProps = { type: 'dynamic' as const, canSleep: true, colliders: false as const, angularDamping, linearDamping };
  const { nodes, materials } = useGLTF(cardGLB) as unknown as { 
    nodes: { card: THREE.Mesh; clip: THREE.Mesh; clamp: THREE.Mesh }; 
    materials: { base: THREE.MeshStandardMaterial; metal: THREE.Material } 
  };
  
  const bandTexture = useTexture(lanyard);
  
  const [curve] = useState(
    () => new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()])
  );
  const [dragged, drag] = useState<THREE.Vector3 | false>(false);
  const [hovered, hover] = useState(false);
  
  const groupRef = useRef<THREE.Group>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useRopeJoint(fixed as any, j1 as any, [[0, 0, 0], [0, 0, 0], 1]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useRopeJoint(j1 as any, j2 as any, [[0, 0, 0], [0, 0, 0], 1]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useRopeJoint(j2 as any, j3 as any, [[0, 0, 0], [0, 0, 0], 1]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useSphericalJoint(j3 as any, card as any, [[0, 0, 0], [0, cardJointY, 0]]);

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? 'grabbing' : 'grab';
      return () => void (document.body.style.cursor = 'auto');
    }
  }, [hovered, dragged]);

  useFrame((state, delta) => {
    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach(ref => ref.current?.wakeUp());
      card.current?.setNextKinematicTranslation({
        x: vec.x - (dragged as THREE.Vector3).x,
        y: vec.y - (dragged as THREE.Vector3).y,
        z: vec.z - (dragged as THREE.Vector3).z
      });
    }
    
    if (fixed.current && groupRef.current) {
      const worldPos = new THREE.Vector3();
      groupRef.current.getWorldPosition(worldPos);
      fixed.current.setNextKinematicTranslation(worldPos);
    }

    if (fixed.current) {
      [j1, j2].forEach(ref => {
        if (!ref.current) return;
        
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const current = ref.current as any;
        const translation = ref.current.translation();
        const translationVec = new THREE.Vector3(translation.x, translation.y, translation.z);
        
        if (!current.lerped) current.lerped = new THREE.Vector3().copy(translationVec);
        
        const clampedDistance = Math.max(0.1, Math.min(1, current.lerped.distanceTo(translationVec)));
        current.lerped.lerp(translationVec, delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed)));
      });
      
      const j3Current = j3.current?.translation();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const j2Current = (j2.current as any)?.lerped;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const j1Current = (j1.current as any)?.lerped;
      const fixedCurrent = fixed.current?.translation();
      
      if (band.current) {
        if (j3Current) {
          vec.set(j3Current.x, j3Current.y, j3Current.z);
          band.current.worldToLocal(vec);
          curve.points[0].copy(vec);
        }
        if (j2Current) {
          vec.copy(j2Current);
          band.current.worldToLocal(vec);
          curve.points[1].copy(vec);
        }
        if (j1Current) {
          vec.copy(j1Current);
          band.current.worldToLocal(vec);
          curve.points[2].copy(vec);
        }
        if (fixedCurrent) {
          vec.set(fixedCurrent.x, fixedCurrent.y, fixedCurrent.z);
          band.current.worldToLocal(vec);
          curve.points[3].copy(vec);
        }
      }
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (band.current as any)?.geometry?.setPoints?.(curve.getPoints(isMobile ? 16 : 32));
      
      const angvel = card.current?.angvel();
      const rotation = card.current?.rotation();
      if (angvel && rotation) {
        ang.copy(new THREE.Vector3(angvel.x, angvel.y, angvel.z));
        rot.copy(new THREE.Vector3(rotation.x, rotation.y, rotation.z));
        card.current?.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z }, true);
      }
    }
  });

  curve.curveType = 'chordal';
  bandTexture.wrapS = bandTexture.wrapT = THREE.RepeatWrapping;

  return (
    <>
      <group ref={groupRef} position={[0, 3, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody position={[segmentLength, 0, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[segmentLength * 2, 0, 0]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[segmentLength * 3, 0, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody 
          position={[segmentLength * 4, 0, 0]} 
          ref={card} 
          {...segmentProps} 
          type={dragged ? 'kinematicPosition' : 'dynamic'}
        >
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group
            scale={2.25}
            position={[0, -1.2, -0.05]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={e => {
              (e.target as HTMLElement).releasePointerCapture(e.pointerId);
              drag(false);
            }}
            onPointerDown={e => {
              (e.target as HTMLElement).setPointerCapture(e.pointerId);
              const cardTrans = card.current?.translation();
              if (cardTrans) {
                drag(new THREE.Vector3().copy(e.point).sub(vec.copy(new THREE.Vector3(cardTrans.x, cardTrans.y, cardTrans.z))));
              }
            }}
          >
            <mesh geometry={nodes.card.geometry}>
              <meshPhysicalMaterial
                map={materials.base.map}
                map-anisotropy={16}
                color={cardColor}
                clearcoat={isMobile ? 0 : 1}
                clearcoatRoughness={0.15}
                roughness={meshRoughness}
                metalness={meshMetalness}
              />
            </mesh>
            <mesh 
              geometry={nodes.clip.geometry} 
              material={materials.metal} 
              material-color={metalColor}
              material-roughness={0.3} 
            />
            <mesh 
              geometry={nodes.clamp.geometry} 
              material={materials.metal} 
              material-color={metalColor}
            />
          </group>
        </RigidBody>
      </group>
      <mesh ref={band}>
        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
        {/* @ts-ignore */}
        <meshLineGeometry />
        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
        {/* @ts-ignore */}
        <meshLineMaterial
          color={bandColor}
          depthTest={false}
          resolution={isMobile ? [1000, 2000] : [1000, 1000]}
          useMap
          map={bandTexture}
          repeat={[-4, 1]}
          lineWidth={bandWidth}
        />
      </mesh>
    </>
  );
}
