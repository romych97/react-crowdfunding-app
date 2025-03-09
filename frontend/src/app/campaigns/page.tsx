"use client";

import { useState, useEffect } from "react";
import { useReadContract } from 'wagmi'
import crowdfundingAbiJson from '@/lib/crowdfundingAbi.json';

export default function Campaigns() {
    const [loading, setLoading] = useState(true);

    const { data: campaigns, isLoading, error } = useReadContract({
        abi: crowdfundingAbiJson.abi,
        address: '0x1575054d52dD5B1B51536B04Fb9A4aEe8C6eF61d',
        functionName: 'getCampaigns',
    }) as any;
    console.log("🚀 ~ Campaigns ~ campaigns:", campaigns)

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Список кампаний</h1>
            {loading ? (
                <p>Загрузка...</p>
            ) : campaigns.length === 0 ? (
                <p>Нет активных кампаний</p>
            ) : (
                <div className="grid gap-4">
                    {campaigns.map((campaign: any, index: any) => (
                        <div key={index} className="p-4 border rounded shadow-md">
                            <h2 className="text-lg font-semibold">{campaign.title}</h2>
                            <p className="text-gray-600">Цель: {campaign.goal.toString()} ETH</p>
                            <p className={`text-sm font-bold ${campaign.completed ? "text-green-600" : "text-red-600"}`}>
                                {campaign.completed ? "Завершено" : "Открыто для донатов"}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
