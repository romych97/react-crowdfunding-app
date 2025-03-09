'use client'

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useLoader, useFrame } from "@react-three/fiber";
import { Physics, useCylinder } from "@react-three/cannon";
import Donate from "@/components/Donate/Donate";
import WalletConnector from "@/components/Login/WalletConnector";

// 🔹 Компонент монеты
const Coin = ({ position }: any) => {
  const texture = new THREE.TextureLoader().load("./bitcoin-texture.png");
  const [coinRef, api] = useCylinder(() => ({
    mass: 1,
    position,
    args: [1.5, 1.5, 0.01, 32],
    velocity: [(Math.random() - 0.5) * 6, (Math.random() - 0.5) * 6, 0], // Движение в 2D
    angularVelocity: [Math.random(), Math.random(), 0], // Вращение
    restitution: 1, // Полный отскок
    friction: 0, // Без трения
    linearDamping: 0.1, // Замедление
  }));

  useEffect(() => {
    if (!coinRef.current) return;

    // Получаем позицию монеты через API
    api.position.subscribe(([x, y]) => {
      const boundaryX = window.innerWidth / 200 - 0.5;
      const boundaryY = window.innerHeight / 200 - 0.5;

      // Если монета выходит за границы — меняем направление
      if (x > boundaryX || x < -boundaryX) {
        api.velocity.set(-Math.sign(x) * Math.abs(x) * 0.5, Math.random() * 6 - 3, 0);
      }
      if (y > boundaryY || y < -boundaryY) {
        api.velocity.set(Math.random() * 6 - 3, -Math.sign(y) * Math.abs(y) * 0.5, 0);
      }
    });
  }, []);

  return (
    <mesh ref={coinRef}>
      <cylinderGeometry args={[0.3, 0.3, 0.05, 32]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
};

// 🔹 Основной компонент сцены
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
    <Canvas style={{ width: "100vw", height: "100vh" }} camera={{ position: [0, 0, 10] }}>
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

// Главная страница
export default function Home() {
  return (
    <div className="w-full h-[100vh]">
      <main className="flex flex-col items-center">
        <div>
          <Donate />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Decentralized Crowdfunding</h1>
          <WalletConnector />
        </div>
      </main>
      <div className="absolute left-0 top-0">
        <CoinScene />
      </div>
    </div>
  );
}
