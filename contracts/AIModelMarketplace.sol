// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AIModelMarketplace {
    struct Model {
        string name;
        string description;
        uint256 price;
        address payable creator;
        uint8 totalRating;
        uint8 ratingCount;
    }

    Model[] public models;
    mapping(uint256 => mapping(address => bool)) public hasPurchased;

    function listModel(string memory name, string memory description, uint256 price) public {
        models.push(Model({
            name: name,
            description: description,
            price: price,
            creator: payable(msg.sender),
            totalRating: 0,
            ratingCount: 0
        }));
    }

    function purchaseModel(uint256 modelId) public payable {
        require(modelId < models.length, "Model does not exist.");
        Model storage model = models[modelId];
        require(msg.value == model.price, "Incorrect payment amount.");
        model.creator.transfer(msg.value);
        hasPurchased[modelId][msg.sender] = true;
    }

    function rateModel(uint256 modelId, uint8 rating) public {
        require(hasPurchased[modelId][msg.sender], "You must purchase the model first.");
        require(rating >= 1 && rating <= 5, "Rating must be between 1 and 5.");
        Model storage model = models[modelId];
        model.totalRating += rating;
        model.ratingCount += 1;
    }

    function getModelDetails(uint256 modelId) public view returns (string memory, string memory, uint256, address, uint8) {
        require(modelId < models.length, "Model does not exist.");
        Model storage model = models[modelId];
        uint8 avgRating = model.ratingCount > 0 ? model.totalRating / model.ratingCount : 0;
        return (model.name, model.description, model.price, model.creator, avgRating);
    }
}
