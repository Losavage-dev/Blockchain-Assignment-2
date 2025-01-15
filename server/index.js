import express from 'express';
import bodyParser from 'body-parser';
import Web3 from 'web3';
import contract from './frontend/src/contract.js';

const app = express();
const port = 3000;

const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");

app.use(bodyParser.json());

app.get('/model/:id', async (req, res) => {
    try {
        const modelId = req.params.id;
        const details = await contract.methods.getModelDetails(modelId).call();
        res.json(details);
    } catch (error) {
        console.error("Error fetching model details:", error);
        res.status(500).send("Error fetching model details.");
    }
});

app.post('/add-model', async (req, res) => {
    try {
        const { name, description, price } = req.body;
        const accounts = await web3.eth.getAccounts();
        await contract.methods.listModel(name, description, price)
            .send({ from: accounts[0] });
        res.status(200).send("Model successfully added!");
    } catch (error) {
        console.error("Error adding model:", error);
        res.status(500).send("Failed to add model.");
    }
});

app.post('/purchase-model', async (req, res) => {
    try {
        const { modelId, price } = req.body;
        const accounts = await web3.eth.getAccounts();
        await contract.methods.purchaseModel(modelId)
            .send({ from: accounts[0], value: web3.utils.toWei(price, 'ether') });
        res.status(200).send("Model purchased successfully!");
    } catch (error) {
        console.error("Error purchasing model:", error);
        res.status(500).send("Failed to purchase model.");
    }
});

app.post('/rate-model', async (req, res) => {
    try {
        const { modelId, rating } = req.body;
        const accounts = await web3.eth.getAccounts();
        await contract.methods.rateModel(modelId, rating)
            .send({ from: accounts[0] });
        res.status(200).send("Model rated successfully!");
    } catch (error) {
        console.error("Error rating model:", error);
        res.status(500).send("Failed to rate model.");
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
