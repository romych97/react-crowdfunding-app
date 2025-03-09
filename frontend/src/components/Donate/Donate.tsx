"use client"

import { useState } from "react";
import { useWriteContract } from 'wagmi'
import crowdfundingAbiJson from '@/lib/crowdfundingAbi.json';

export default function Donate() {

    const [amount, setAmount] = useState("");
    const [campaignId, setCampaignId] = useState("");

    const { writeContract } = useWriteContract()

    const donateToCampaign = async (campaignId: any, amount: string) => {
        try {
            const result = writeContract({
                address: '0x1575054d52dD5B1B51536B04Fb9A4aEe8C6eF61d',
                abi: crowdfundingAbiJson.abi,
                functionName: "donateToCampaign",
                args: [campaignId],
                value: BigInt(amount), // sum in wei
            })

            console.log("🚀 Donation successful:", result);
        } catch (error) {
            console.error("Donation error:", error);
        }
    };

    return (
        <main className="flex flex-col items-center">
            <div>
                <div>
                    <input
                        type="number"
                        placeholder="Enter amount in ETH"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                    <button onClick={() => donateToCampaign(campaignId, amount)}>
                        Donate
                    </button>
                </div>
            </div>
        </main>
    );
}
