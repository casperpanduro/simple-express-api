const express = require('express');
const app = express();
const records = require('./records');

app.use(express.json()); // exporess middleware -> tells requests that comes in as json

function asyncHandler(cb) {
	return async (req, res, next) => {
		try {
			await cb(req, res, next);
		} catch(err) {
			next(err);
		}
	}
}

// Send a GET request to /quotes to read a list of quotes
app.get('/quotes', asyncHandler(async (req, res) => {
	const quotes = await records.getQuotes();
	res.json(quotes);
}));

// Send GET request to /quotes/:id read a quote
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
app.post('/quotes', asyncHandler(async (req, res) => {
	if (req.body.author && req.body.quote) {
		const quote = await records.createQuote({
			quote: req.body.quote,
			author: req.body.author
		});
		res.status(201).json(quote);
	} else {
		res.status(400).json({message: "Bad request - requred author and quote"});
	}
}));

// Send PUT request to /quotes/:id to update quote
app.put('/quotes/:id', asyncHandler( async (req, res) => {
	const quote = await records.getQuote(req.params.id);
	if (quote) {
		quote.quote = req.body.quote ? req.body.quote : quote.quote;
		quote.author = req.body.author ? req.body.author : quote.author;
		
		await records.updateQuote(quote);
		res.status(204).end();
	} else {
		res.status(404).json({message: "Quote does not exist"});
	}
}));
// Send DELETE request to /quotes/:id to delete a quote
app.delete('/quotes/:id', asyncHandler(async (req, res, next) => {
	const quote = await records.getQuote(req.params.id);
	if (quote) {
		await records.deleteQuote(quote);
		res.status(204).end();
	} else {
		next();
	}
}));

// Send a GET request to /quotes/quote/random read a random quote

app.use((req, res, next) => {
	const err = new Error("Not found");
	err.status = 404;
	next(err);
});

app.use((err, req, res, next) => {
	res.status(err.status || 500);
	res.json({
		error: {
			message: err.message
		}
	})
});

app.listen(3000, () => console.log('Quote API listening on port 3000!'));