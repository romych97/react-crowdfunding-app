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
        require(_deadline > block.number, "Invalid deadline");
        campaigns.push(Campaign(msg.sender, emptyArray, _title, _description, _goal, _deadline, 0));
    }

    function donate(uint256 _index) external payable {
        Campaign storage campaign = campaigns[_index];
        require(block.number < campaign.deadline, "Campaign ended");
        campaign.fundsRaised += msg.value;
    }

    function withdrawFunds(uint256 _index) external {
        Campaign storage campaign = campaigns[_index];
        require(msg.sender == campaign.owner, "Not campaign owner");
        require(campaign.fundsRaised >= campaign.goal, "Goal not reached");

        uint256 amount = campaign.fundsRaised;
        campaign.fundsRaised = 0;  // set sum to zero for excluding repeated callbacks

        (bool success, ) = payable(campaign.owner).call{value: amount}("");
        require(success, "Transfer failed");
    }

    function donateToCampaign(uint256 _campaignId) public payable {
        require(msg.value > 0, "Donation must be greater than 0");
        require(_campaignId < campaigns.length, "Invalid campaign ID");

        campaigns[_campaignId].fundsRaised += msg.value;
        campaigns[_campaignId].donors.push(msg.sender);
    }

}
