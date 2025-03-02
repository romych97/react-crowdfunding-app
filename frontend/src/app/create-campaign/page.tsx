"use client";

import { useState } from "react";
import { writeContract } from '@wagmi/core'
import { useAccount } from "wagmi";

import { config } from '@/lib/wagmiConfig';
import crowdfundingAbiJson from '@/lib/crowdfundingAbi.json';

export default function CreateCampaign() {
    const [title, setTitle] = useState("");
    const [goal, setGoal] = useState("");

    const { isConnected, address } = useAccount();
    console.log("🚀 ~ CreateCampaign ~ address:", address)
    console.log("🚀 ~ CreateCampaign ~ isConnected:", isConnected)

    const createCampaign = async () => {

        if (!isConnected) {
            alert("Please connect your wallet first!");
            return;
        }

        try {
            const result = await writeContract(config, {
                address: '0x1575054d52dD5B1B51536B04Fb9A4aEe8C6eF61d',
                abi: crowdfundingAbiJson.abi,
                functionName: 'createCampaign',
                args: [title, '', BigInt(goal), address],
            })

            console.log("🚀 Кампания создана:", result);
            alert("Кампания успешно создана!");
        } catch (error) {
            console.error("Ошибка:", error);
            alert("Ошибка при создании кампании");
        }
    };

    return (
        <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-xl">
            <h1 className="text-2xl font-bold mb-4 text-black">Создать кампанию</h1>
            <input
                type="text"
                placeholder="Название"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 border rounded mb-3 text-black"
            />
            <input
                type="number"
                placeholder="Цель (ETH)"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full p-2 border rounded mb-3 text-black"
            />
            <button
                onClick={createCampaign}
                className="w-full bg-blue-600 text-white p-2 rounded"
            >
                Создать
            </button>
        </div>
    );
}
