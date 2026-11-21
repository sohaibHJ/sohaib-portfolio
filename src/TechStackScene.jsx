import { Component, Suspense, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Decal, Float, OrbitControls, useTexture } from '@react-three/drei';
import * as THREE from 'three';

const items = [
  ['React','https://cdn.simpleicons.org/react/168BCE'],['JavaScript','https://cdn.simpleicons.org/javascript/BA9B00'],['TypeScript','https://cdn.simpleicons.org/typescript/3178C6'],['HTML5','https://cdn.simpleicons.org/html5/E34F26'],['CSS3','https://cdn.simpleicons.org/css/1572B6'],['Tailwind','https://cdn.simpleicons.org/tailwindcss/06B6D4'],['Node.js','https://cdn.simpleicons.org/nodedotjs/5FA04E'],['Express','https://cdn.simpleicons.org/express/222222'],['Python','https://cdn.simpleicons.org/python/3776AB'],['Java','https://cdn.simpleicons.org/openjdk/437291'],['PostgreSQL','https://cdn.simpleicons.org/postgresql/4169E1'],['Supabase','https://cdn.simpleicons.org/supabase/3FCF8E'],['Git','https://cdn.simpleicons.org/git/F05032'],['GitHub','https://cdn.simpleicons.org/github/222222'],['Docker','https://cdn.simpleicons.org/docker/2496ED'],['Three.js','https://cdn.simpleicons.org/threedotjs/222222'],['GSAP','https://cdn.simpleicons.org/greensock/88CE02'],['Expo','https://cdn.simpleicons.org/expo/222222'],['React Native','https://cdn.simpleicons.org/react/168BCE'],['Figma','https://cdn.simpleicons.org/figma/F24E1E'],['Vite','https://cdn.simpleicons.org/vite/646CFF']
];
// Dense, cloud-like arrangement similar to the supplied reference image.
const slots = items.map((_, i) => {
  const angle = i * 2.399963;
  const radius = 1.12 + ((i % 5) * 0.11);
  return [Math.cos(angle) * radius, Math.sin(angle) * radius * 0.58, ((i % 5) - 2) * 0.22];
});
function Ball({ item, slot, index }) {
  const texture = useTexture(item[1]);
  texture.colorSpace = THREE.SRGBColorSpace;
  const group = useRef();
  const seed = index * 1.37;
  useFrame(({ clock }) => {
    if (!group.current) return;
    const t = clock.elapsedTime;
    group.current.position.x = THREE.MathUtils.damp(group.current.position.x, slot[0] + Math.sin(t * .42 + seed) * .13, 3, 1/60);
    group.current.position.y = THREE.MathUtils.damp(group.current.position.y, slot[1] + Math.cos(t * .48 + seed) * .12, 3, 1/60);
    group.current.position.z = THREE.MathUtils.damp(group.current.position.z, slot[2] + Math.sin(t * .65 + seed) * .15, 3, 1/60);
    group.current.rotation.y += .004 + Math.sin(t * .25 + seed) * .0015;
    group.current.rotation.x += .0018;
  });
  const radius = .38 + ((index % 4) * .045);
  return <group ref={group}>
    <mesh><sphereGeometry args={[radius, 48, 48]} /><meshPhysicalMaterial color="#f8f7fa" roughness={.19} metalness={.025} clearcoat={1} clearcoatRoughness={.1} /></mesh>
    <Decal position={[0, 0, radius * .96]} rotation={[0, 0, 0]} scale={radius * .72} map={texture} depthTest depthWrite={false} />
  </group>;
}
function PlainBall({ slot, index }) {
  const ref=useRef(); const seed=index*1.37; const radius=.38+((index%4)*.045);
  useFrame(({clock})=>{if(!ref.current)return;const t=clock.elapsedTime;ref.current.position.x=THREE.MathUtils.damp(ref.current.position.x,slot[0]+Math.sin(t*.42+seed)*.13,3,1/60);ref.current.position.y=THREE.MathUtils.damp(ref.current.position.y,slot[1]+Math.cos(t*.48+seed)*.12,3,1/60);ref.current.position.z=THREE.MathUtils.damp(ref.current.position.z,slot[2]+Math.sin(t*.65+seed)*.15,3,1/60);ref.current.rotation.y+=.004;ref.current.rotation.x+=.0018;});
  return <group ref={ref}><mesh><sphereGeometry args={[radius,48,48]}/><meshPhysicalMaterial color="#f8f7fa" roughness={.19} metalness={.025} clearcoat={1} clearcoatRoughness={.1}/></mesh></group>;
}
class LogoErrorBoundary extends Component {
  constructor(props){ super(props); this.state={failed:false}; }
  static getDerivedStateFromError(){ return {failed:true}; }
  render(){ return this.state.failed ? this.props.fallback : this.props.children; }
}
function SafeLogoBall({ item, slot, index }) {
  // Each texture is isolated so one unavailable logo won't blank the whole 3D scene.
  return <LogoErrorBoundary fallback={<PlainBall slot={slot} index={index}/>}><Suspense fallback={<PlainBall slot={slot} index={index}/>}><Ball item={item} slot={slot} index={index}/></Suspense></LogoErrorBoundary>;
}
function Cluster() {
  const [order, setOrder] = useState(items.map((_,i)=>i));
  const last=useRef(0); const lastX=useRef(0); const lastY=useRef(0);
  const onMove=(e)=>{
    const now=performance.now(); const x=e.point.x; const y=e.point.y;
    if(now-last.current<160 || (Math.abs(x-lastX.current)+Math.abs(y-lastY.current)<.24)) return;
    last.current=now; lastX.current=x; lastY.current=y;
    const a=Math.min(items.length-1,Math.max(0,Math.floor((x+2.4)/4.8*items.length)));
    let b=Math.min(items.length-1,Math.max(0,Math.floor((y+2.1)/4.2*items.length)));
    if(a===b)b=(b+8)%items.length;
    setOrder(prev=>{const next=[...prev];[next[a],next[b]]=[next[b],next[a]];return next;});
  };
  return <group onPointerMove={onMove}>{order.map((itemIndex,slotIndex)=><Float key={items[itemIndex][0]} speed={.35+(slotIndex%5)*.12} rotationIntensity={.18} floatIntensity={.18}><SafeLogoBall item={items[itemIndex]} slot={slots[slotIndex]} index={itemIndex}/></Float>)}</group>;
}
export default function TechStackScene(){
  return <div className="tech3d-wrap"><Canvas camera={{position:[0,0,7.3],fov:45}} gl={{alpha:true,antialias:true}} dpr={[1,1.6]}>
    <ambientLight intensity={1.4}/><directionalLight position={[3,4,5]} intensity={2.6}/><pointLight position={[-4,-3,2]} intensity={1.6} color="#e3d8ff"/>
    <Cluster/><OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={.22} rotateSpeed={.45}/>
  </Canvas></div>;
}
