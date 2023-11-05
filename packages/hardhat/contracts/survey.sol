// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract SurveyToken is ERC721URIStorage, AccessControl, ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _surveyIds;

    bytes32 public constant SURVEY_SUBMITTER_ROLE = keccak256("SURVEY_SUBMITTER_ROLE");

    string public url;

    event SurveyCompleted(uint256 indexed surveyId, address indexed owner, string uri);

    constructor(string memory name, string memory symbol, address surveyFactoryDeployer, string memory _url) ERC721(name, symbol) {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);  // The deployer of SurveyToken contract has the DEFAULT_ADMIN_ROLE
        _setupRole(SURVEY_SUBMITTER_ROLE, surveyFactoryDeployer);  // The deployer of SurveyTokenFactory contract has the SURVEY_SUBMITTER_ROLE
        url = _url;  // initialize url
    }

    modifier onlySurveySubmitter() {
        require(hasRole(SURVEY_SUBMITTER_ROLE, msg.sender), "SurveyToken: Caller is not a survey submitter");
        _;
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721URIStorage, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function submitSurvey(address respondent, string memory surveyMetadataURI)
        public
        onlySurveySubmitter
        nonReentrant
        returns (uint256)
    {
        require(bytes(surveyMetadataURI).length > 0, "SurveyToken: Invalid URI");
        require(respondent != address(0), "SurveyToken: respondent address cannot be 0");

        uint256 newSurveyId = _surveyIds.current();
        _mint(respondent, newSurveyId);
        _setTokenURI(newSurveyId, surveyMetadataURI);

        _surveyIds.increment();

        emit SurveyCompleted(newSurveyId, respondent, surveyMetadataURI);

        return newSurveyId;
    }

    function getAllTokenHolders() public view returns (address[] memory, string[] memory) {
        uint256 totalSupply = _surveyIds.current();
        address[] memory holders = new address[](totalSupply);
        string[] memory tokenURIs = new string[](totalSupply);

        for (uint256 i = 0; i < totalSupply; i++) {
            holders[i] = ownerOf(i);
            tokenURIs[i] = tokenURI(i);
        }

        return (holders, tokenURIs);
    }
}
