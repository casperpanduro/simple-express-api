const express = require('express');
const app = express();
const records = require('./records');

app.use(express.json()); // exporess middleware -> tells requests that comes in as json

// Send a GET request to /quotes to read a list of quotes
app.get('/quotes', async (req, res) => {
	try {
		const quotes = await records.getQuotes();
		res.json(quotes);
	} catch(err) {
		res.status(500).json({message: err.message});
	}
	
});

// Send GET request to /quotes/:id read a quote
// Send a GET request to /quotes to read a list of quotes
app.get('/quotes/:id', async (req, res) => {
	try {
		const quote = await records.getQuote(req.params.id);
		if (quote) {
			res.json(quote);
		} else {
			res.status(404).json({message: "Quote does not exist"});
		}
		
	} catch(err) {
		res.status(500).json({message: err.message});
	}
	
});

// Send POST request to /quotes to create new quote
app.post('/quotes', async (req, res) => {
	try {
		if (req.body.author && req.body.quote) {
			const quote = await records.createQuote({
				quote: req.body.quote,
				author: req.body.author
			});
			res.status(201).json(quote);
		} else {
			res.status(400).json({message: "Bad request - requred author and quote"});
		}
		
	}catch(err) {
		res.status(500).json({message: err.message});
	}
	
});

// Send PUT request to /quotes/:id to update quote
app.put('/quotes/:id', async (req, res) => {
	try	{
		const quote = await records.getQuote(req.params.id);
		if (quote) {
			quote.quote = req.body.quote ? req.body.quote : quote.quote;
			quote.author = req.body.author ? req.body.author : quote.author;
			
			await records.updateQuote(quote);
			res.status(204).end();
		} else {
			res.status(404).json({message: "Quote does not exist"});
		}
		
	} catch(err) {
		res.status(500).json({message: err.message});
	}
})
// Send DELETE request to /quotes/:id to delete a quote
app.delete('/quotes/:id', async (req, res) => {
	try {
		const quote = await records.getQuote(req.params.id);
		await records.deleteQuote(quote);
		res.status(204).end();

	} catch(err) {
		res.status(500).json({message: err.message});
	}
});
// Send a GET request to /quotes/quote/random read a random quote

app.listen(3000, () => console.log('Quote API listening on port 3000!'));

const data = {
    quotes: [
      {
        id: 8721,
        quote: "We must accept finite disappointment, but we must never lose infinite hope.",
        author: "Martin Luther King"
      },
      {
        id: 5779,
        quote: "Use what you’ve been through as fuel, believe in yourself and be unstoppable!",
        author: "Yvonne Pierre"
      },
      {
        id: 3406,
        quote: "To succeed, you have to do something and be very bad at it for a while. You have to look bad before you can look really good.",
        author: "Barbara DeAngelis"
      }
    ]
  }
