// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "./interfaces/ISurveyToken.sol";
import "./survey.sol"; 

contract SurveyTokenFactory is AccessControl {
    bytes32 public constant SURVEY_CREATOR_ROLE = keccak256("SURVEY_CREATOR_ROLE");

    address[] public deployedSurveys;

    event SurveyDeployed(address indexed surveyAddress, address indexed surveyDeployer, uint256 surveyId);
    event SurveySubmitted(address indexed surveyAddress, address indexed respondent, uint256 surveyId);

    constructor() {
        _setupRole(SURVEY_CREATOR_ROLE, msg.sender);
    }

    function createSurvey(string memory name, string memory symbol, string memory url) public onlyRole(SURVEY_CREATOR_ROLE) returns (address surveyAddress, uint256 surveyId) {
        require(bytes(name).length > 0, "SurveyTokenFactory: Name cannot be empty");
        require(bytes(symbol).length > 0, "SurveyTokenFactory: Symbol cannot be empty");

        SurveyToken newSurveyToken = new SurveyToken(name, symbol, msg.sender, url);
        deployedSurveys.push(address(newSurveyToken));
        surveyAddress = address(newSurveyToken);
        surveyId = deployedSurveys.length - 1;

        newSurveyToken.grantRole(newSurveyToken.SURVEY_SUBMITTER_ROLE(), msg.sender);

        emit SurveyDeployed(surveyAddress, msg.sender, surveyId);
        return (surveyAddress, surveyId);
    }

    function submitSurvey(address surveyAddress, address respondent, string memory surveyMetadataURI) public returns (uint256 surveyId) {
        require(surveyAddress != address(0), "SurveyTokenFactory: Invalid address");
        require(respondent != address(0), "SurveyTokenFactory: Invalid respondent address");

        SurveyToken surveyToken = SurveyToken(surveyAddress);
        surveyId = surveyToken.submitSurvey(respondent, surveyMetadataURI);

        emit SurveySubmitted(surveyAddress, respondent, surveyId);
        return surveyId;
    }

    function getDeployedSurveys() public view returns (address[] memory) {
        return deployedSurveys;
    }
}