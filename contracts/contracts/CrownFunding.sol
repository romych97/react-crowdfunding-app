// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Crowdfunding {
    struct Campaign {
        address owner;
        address[] donors;
        string title;
        string description;
        uint256 goal;
        uint256 deadline;
        uint256 fundsRaised;
    }

    Campaign[] public campaigns;

    function getCampaigns() external view returns (Campaign[] memory) {
        return campaigns;
    }
    
    function createCampaign(
        string memory _title,
        string memory _description,
        uint256 _goal,
        uint256 _deadline
    ) external {
        address[] memory emptyArray;
        require(_deadline > block.timestamp, "Invalid deadline");
        campaigns.push(Campaign(msg.sender, emptyArray, _title, _description, _goal, _deadline, 0));
    }

    function donate(uint256 _index) external payable {
        Campaign storage campaign = campaigns[_index];
        require(block.timestamp < campaign.deadline, "Campaign ended");
        campaign.fundsRaised += msg.value;
    }

    function withdrawFunds(uint256 _index) external {
        Campaign storage campaign = campaigns[_index];
        require(msg.sender == campaign.owner, "Not campaign owner");
        require(campaign.fundsRaised >= campaign.goal, "Goal not reached");
        payable(campaign.owner).transfer(campaign.fundsRaised);
    }

    function donateToCampaign(uint256 _campaignId) public payable {
        require(msg.value > 0, "Donation must be greater than 0");
        require(_campaignId < campaigns.length, "Invalid campaign ID");

        campaigns[_campaignId].fundsRaised += msg.value;
        campaigns[_campaignId].donors.push(msg.sender);
    }

}
