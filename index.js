const server = require('./server');

const port = process.env.PORT || 5000;

server.listen(port, () => console.log(`\n\n \u{1F680} \u{1F680} \u{1F680} API Live At: ${port} \n\n`));