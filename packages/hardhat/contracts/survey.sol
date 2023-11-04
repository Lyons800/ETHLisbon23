// contracts/GameItem.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract SurveyToken is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _surveyIds;

    constructor() ERC721("SurveyToken", "SVY") {}

    function submitSurvey(address respondent, string memory surveyMetadataURI)
        public
        returns (uint256)
    {
        uint256 newSurveyId = _surveyIds.current();
        _mint(respondent, newSurveyId);
        _setTokenURI(newSurveyId, surveyMetadataURI);

        _surveyIds.increment();
        return newSurveyId;
    }

    // Additional functions and modifiers can be added for access control and other features
    
}