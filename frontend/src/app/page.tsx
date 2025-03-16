'use client'

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useLoader, useFrame } from "@react-three/fiber";
import { Physics, useCylinder } from "@react-three/cannon";
import Donate from "@/components/Donate/Donate";
import WalletConnector from "@/components/Login/WalletConnector";

// 🔹 Coin component
const Coin = ({ position }: any) => {
  const texture = new THREE.TextureLoader().load("./bitcoin-texture.png");

  const [coinRef, api] = useCylinder(() => ({
    mass: 1,
    position: [position[0], position[1], 0],
    args: [1.5, 1.5, 0.01, 32],
    velocity: [(Math.random() - 0.5) * 3, (Math.random() - 0.5) * 3, 0],
    angularVelocity: [0, 0, Math.random()],
    restitution: 0.9, // Almost a springy blow (slightly less than 1 for stability)
    friction: 0.01, // Minimal friction for slowdown
    linearDamping: 0.05, // Smooth speed fade
    sleepSpeedLimit: 0.1, // Speed ​​threshold for "falling asleep"
    sleepTimeLimit: 1, // Time before transition to "sleep"
    collisionFilterGroup: 1, // Collision group
    collisionFilterMask: 1, // Collision only with similar objects
  }));

  useEffect(() => {
    const handleCollision = async () => {
      const position = await new Promise((resolve) => {
        api.position.subscribe(resolve);
      });

      const [x, y] = position as any;
      const boundaryX = window.innerWidth / 200;
      const boundaryY = window.innerHeight / 200;

      if (x > boundaryX || x < -boundaryX) {
        api.velocity.set(-Math.sign(x) * 2, (Math.random() - 0.5) * 3, 0);
      }
      if (y > boundaryY || y < -boundaryY) {
        api.velocity.set((Math.random() - 0.5) * 3, -Math.sign(y) * 2, 0);
      }
    };

    const interval = setInterval(handleCollision, 100);
    return () => clearInterval(interval);
  }, [api.position, api.velocity]);

  return (
    <mesh ref={coinRef}>
      <cylinderGeometry args={[0.3, 0.3, 0.05, 32]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
};


// 🔹 Main scene component
const CoinScene = () => {
  const [size, setSize] = useState({ width: 10, height: 6 });

  useEffect(() => {
    const updateSize = () => {
      setSize({
        width: window.innerWidth / 100,
        height: window.innerHeight / 100,
      });
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const numCoins = 25;
  const coins = Array.from({ length: numCoins }, () => ({
    position: [(Math.random() - 0.5) * size.width, (Math.random() - 0.5) * size.height, 0],
  }));

  return (
    <Canvas
      orthographic
      camera={{ position: [0, 0, 10], zoom: 108 }}
      style={{ width: "100vw", height: "100vh" }}
    >
      <Physics gravity={[0, 0, 0]}>
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} />
        {coins.map((coin, i) => (
          <Coin key={i} position={coin.position} />
        ))}
      </Physics>
    </Canvas>
  );
};



// Main page
export default function Home() {
  return (
    <div className="w-full h-[100vh]">
      <main className="flex flex-col items-center justify-center w-full h-full z-50">
        <div>
          <div>
            <Donate />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Decentralized Crowdfunding</h1>
            <WalletConnector />
          </div>
        </div>
      </main>
      <div className="absolute left-0 top-0 z-[-1]">
        <CoinScene />
      </div>
    </div>
  );
}
