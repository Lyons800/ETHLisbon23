// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

// Interface for SurveyToken
interface ISurveyToken {
    function submitSurvey(address respondent, string calldata surveyMetadataURI) external returns (uint256);
    function getAllTokenHolders() external view returns (address[] memory, string[] memory);
}
