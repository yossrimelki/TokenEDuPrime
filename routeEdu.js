const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
const { ethers } = require('ethers');
require('dotenv').config();
const { abi } = require('./artifacts/contracts/EduToken.sol/EduToken.json');
const port = 3000;

const API_URL = process.env.PROVIDER_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

const provider = new ethers.providers.JsonRpcProvider(API_URL);
const signer = new ethers.Wallet(PRIVATE_KEY, provider);
const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);

// Define Express routes

app.get('/name', async (req, res) => {
  try {
    const name = await contract.name();
    res.json({ name });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/symbol', async (req, res) => {
  try {
    const symbol = await contract.symbol();
    res.json({ symbol });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/decimals', async (req, res) => {
  try {
    const decimals = await contract.decimals();
    res.json({ decimals });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/totalSupply', async (req, res) => {
  try {
    const totalSupply = await contract.totalSupply();
    res.json({ totalSupply });
   } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/balance/:account', async (req, res) => {
    const account = req.params.account;
    try {
      const balance = await contract.balanceOf(account);
      const plainBalance = await balance.toNumber(); // Wait for the Promise to resolve before calling toNumber()
      res.json({ balance: plainBalance });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

app.get('/allowance/:owner/:spender', async (req, res) => {
  const owner = req.params.owner;
  const spender = req.params.spender;
  try {
    const allowance = await contract.allowance(owner, spender);
    res.json({ allowance });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Your route definition
app.post('/transfer', async (req, res) => {
  const { to, amount } = req.body;

  if (!to || !amount) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Your transaction logic here
    res.json({ message: 'Transaction processed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/approve', async (req, res) => {
  const { spender, amount } = req.body;
  try {
    const transaction = await contract.approve(spender, amount);
    res.json({ transactionHash: transaction.hash });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



app.post('/transferFrom', async (req, res) => {
  const { from, to, amount } = req.body;
  try {
    const transaction = await contract.transferFrom(from, to, amount);
    res.json({ transactionHash: transaction.hash });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/generateWallet', (req, res) => {
  try {
      const wallet = ethers.Wallet.createRandom();
      res.json({
          address: wallet.address,
          privateKey: wallet.privateKey
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Add more routes for other contract functions as needed

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
