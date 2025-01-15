import React, { useState, useEffect } from 'react';
import contract from './contract'; // Импорт контракта для взаимодействия
import web3 from './web3'; // Импорт экземпляра web3.js

function App() {
    // Состояния для хранения данных
    const [models, setModels] = useState([]);
    const [newModel, setNewModel] = useState({ name: '', description: '', price: '' });
    const [selectedModel, setSelectedModel] = useState(null);
    const [rating, setRating] = useState(0);
    const [account, setAccount] = useState('');

    // Загружаем данные при инициализации компонента
    useEffect(() => {
        const loadBlockchainData = async () => {
            const accounts = await web3.eth.getAccounts();
            setAccount(accounts[0]);

            const modelsCount = await contract.methods.getModelCount().call();
            const modelsArray = [];

            for (let i = 0; i < modelsCount; i++) {
                const model = await contract.methods.getModelDetails(i).call();
                modelsArray.push({
                    id: i,
                    name: model[0],
                    description: model[1],
                    price: web3.utils.fromWei(model[2], 'ether'),
                    creator: model[3],
                    rating: model[4],
                });
            }

            setModels(modelsArray);
        };

        loadBlockchainData();
    }, []);

    // Обработчик добавления модели
    const handleAddModel = async () => {
        const { name, description, price } = newModel;
        await contract.methods
            .listModel(name, description, web3.utils.toWei(price, 'ether'))
            .send({ from: account });
        window.location.reload();
    };

    // Обработчик покупки модели
    const handlePurchaseModel = async (modelId, price) => {
        await contract.methods
            .purchaseModel(modelId)
            .send({ from: account, value: web3.utils.toWei(price, 'ether') });
        alert('Model purchased successfully!');
    };

    // Обработчик оценки модели
    const handleRateModel = async (modelId) => {
        await contract.methods.rateModel(modelId, rating).send({ from: account });
        alert('Model rated successfully!');
    };

    return (
        <div>
            <h1>AI Model Marketplace</h1>
            <p>Connected account: {account}</p>

            <div>
                <h2>Add New Model</h2>
                <input
                    type="text"
                    placeholder="Name"
                    value={newModel.name}
                    onChange={(e) => setNewModel({ ...newModel, name: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Description"
                    value={newModel.description}
                    onChange={(e) => setNewModel({ ...newModel, description: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Price (in ETH)"
                    value={newModel.price}
                    onChange={(e) => setNewModel({ ...newModel, price: e.target.value })}
                />
                <button onClick={handleAddModel}>Add Model</button>
            </div>

            <div>
                <h2>Available Models</h2>
                {models.map((model) => (
                    <div key={model.id}>
                        <h3>{model.name}</h3>
                        <p>{model.description}</p>
                        <p>Price: {model.price} ETH</p>
                        <p>Rating: {model.rating}</p>
                        <button onClick={() => handlePurchaseModel(model.id, model.price)}>
                            Purchase
                        </button>
                        <input
                            type="number"
                            placeholder="Rate (1-5)"
                            onChange={(e) => setRating(e.target.value)}
                        />
                        <button onClick={() => handleRateModel(model.id)}>Rate</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default App;
