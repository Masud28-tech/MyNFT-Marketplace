//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import "hardhat/console.sol";

contract NFTMarketplace is ERC721URIStorage {
    using Counters for Counters.Counter; // allows us to use the coutner utility.

    Counters.Counter private _tokenIds;     // when the first token is minted it'll get a value of zero, the second one is one
    Counters.Counter private _itemsSold;    // and then using counters this we'll increment token ids


    uint256 listingPrice = 0.025 ether;

    address payable owner;     // declaring the owner of the contrac, owner earns a commision on every item sold

    mapping(uint256 => MarketItem) private idToMarketItem;     // keeping up with all the items that have been created && Pass in the integer which is the item id and it returns a market item. && To fetch a market item, we only need the item id

    struct MarketItem {
        uint256 tokenId;
        address payable seller;
        address payable owner;
        uint256 price;
        bool sold;
    }

    // have an event for when a market item is created. this event matches the MarketItem
    event MarketItemCreated ( 
        uint256 indexed tokenId,
        address seller,
        address owner,
        uint256 price,
        bool sold
    );

    constructor () ERC721("Metaverse Tokens", "METT") {
        owner = payable(msg.sender);
    }

    function updateListingPrice(uint256 _listingPrice) public payable {
        require(owner == msg.sender, 'Only marketplace owner can change the listing price!');

        listingPrice = _listingPrice;
    }

    function getListingPrice() public view returns(uint256){
        return listingPrice;
    }

    function createToken(string memory tokenURI, uint256 price) public payable returns(uint256){
        _tokenIds.increment();

        uint256 newTokenId = _tokenIds.current();

        _mint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);

        createMarketItem(newTokenId, price);

        return newTokenId;
    }

    function createMarketItem(uint256 tokenId, uint256 price) private {
        require(price > 0, "Price must be at least 1.");
        require(msg.value == listingPrice, "Price must be equal to listing price.");

        idToMarketItem[tokenId] = MarketItem(
            tokenId,
            payable(msg.sender),
            payable(address(this)),
            price,
            false
        );

        _transfer(msg.sender, address(this), tokenId);

        emit MarketItemCreated(
            tokenId,
            msg.sender,
            address(this),
            price,
            false
        );
    }

    function resellToken(uint256 tokenId, uint256 price) public payable {
        require(idToMarketItem[tokenId].owner == msg.sender, "Only item owner can perform this operation.");
        require(msg.value == listingPrice, "Price must be equal to listing price.");

        idToMarketItem[tokenId].sold = false;
        idToMarketItem[tokenId].price = price;
        idToMarketItem[tokenId].seller = payable(msg.sender);
        idToMarketItem[tokenId].owner = payable(address(this));

        _transfer(msg.sender, address(this), tokenId);
    } 
    
    function createMarketSale(uint256 tokenId) public payable {
        uint256 price = idToMarketItem[tokenId].price;

        require(msg.value == price, "Please submit the asking price in order to complete the purchase.");

        idToMarketItem[tokenId].sold = true;
        idToMarketItem[tokenId].seller = payable(address(0));
        idToMarketItem[tokenId].owner = payable(msg.sender);

        _itemsSold.increment();

        _transfer(address(0), msg.sender, tokenId);

        payable(owner).transfer(listingPrice);
        payable(idToMarketItem[tokenId].seller).transfer(msg.value);
    }

    function fetchMarketItems() public view returns(MarketItem[] memory) {
        uint256 itemsCount = _tokenIds.current();
        uint256 unsoldItemsCount = _tokenIds.current()  - _itemsSold.current();
        uint256 currentIndex = 0;

        MarketItem[] memory items = new MarketItem[](unsoldItemsCount);

        for(uint i=0; i<itemsCount; i++) {
            if(idToMarketItem[i+1].owner == address(this)) {
                uint currentId = i+1;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1; 
            }
        }
        return items;
    }  

    function fetchMyNFTs() public view returns(MarketItem[] memory) {
        uint256 totalItemsCount = _tokenIds.current();
        uint256 myItemsCount = 0;
        uint256 currentIndex = 0;

        for(uint i=0; i<totalItemsCount; i++) {
            if(idToMarketItem[i+1].owner == msg.sender) {
                myItemsCount += 1;
            }
        }

        MarketItem[] memory items = new MarketItem[](myItemsCount);

        for(uint i=0; i<totalItemsCount; i++) {
            if(idToMarketItem[i+1].owner == msg.sender) {
                uint currentId = i+1;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1; 
            }
        }
        return items;
    } 

    function fetchNFTsListed() public view returns(MarketItem[] memory) {
        uint256 totalItemsCount = _tokenIds.current();
        uint256 myItemsCount = 0;
        uint256 currentIndex = 0;

        for(uint i=0; i<totalItemsCount; i++) {
            if(idToMarketItem[i+1].seller == msg.sender) {
                myItemsCount += 1;
            }
        }

        MarketItem[] memory items = new MarketItem[](myItemsCount);

        for(uint i=0; i<totalItemsCount; i++) {
            if(idToMarketItem[i+1].seller == msg.sender) {
                uint currentId = i+1;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1; 
            }
        }
        return items;
    } 
}
