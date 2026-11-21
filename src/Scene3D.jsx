
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment, Stars } from "@react-three/drei";
import { useRef } from "react";


function Orb() {
  const orb = useRef();
  const core = useRef();

  useFrame((state, delta) => {
    if (!orb.current || !core.current) return;

    orb.current.rotation.x += delta * 0.12;
    orb.current.rotation.y += delta * 0.2;

    orb.current.rotation.x += state.pointer.y * 0.002;
    orb.current.rotation.y += state.pointer.x * 0.002;

    core.current.rotation.y -= delta * 0.15;
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
      <group>
        <mesh ref={orb}>
          <icosahedronGeometry args={[1.5, 3]} />
          <meshStandardMaterial
            color="#b6ff63"
            emissive="#527d22"
            emissiveIntensity={0.8}
            metalness={0.9}
            roughness={0.15}
            wireframe
          />
        </mesh>

        <mesh ref={core}>
          <icosahedronGeometry args={[0.65, 2]} />
          <meshBasicMaterial
            color="#b6ff63"
            wireframe
            transparent
            opacity={0.45}
          />
        </mesh>

        <mesh>
          <sphereGeometry args={[0.35, 32, 32]} />
          <meshBasicMaterial color="#d8ffad" />
        </mesh>
      </group>
    </Float>
  );
}


export default function Scene3D() {
  return (
    <div style={{ width: "100%", height: "420px" }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <color attach="background" args={["#05070d"]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[3, 3, 3]} intensity={3} color="#b6ff63" />
        <pointLight position={[-3, -2, 2]} intensity={2} color="#dfffbd" />
        <Stars radius={80} depth={40} count={1200} factor={3} fade />
        <Orb />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
