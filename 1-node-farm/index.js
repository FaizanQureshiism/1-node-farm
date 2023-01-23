const fs = require('fs');
const http = require('http')
const url = require('url')
//import modules
const replaceTemplate = require('./modules/replaceTemplate')

////////////////////////////
///// Files
// Blocking, Synchronous
//const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');
//console.log(textIn);
//const textOut = `This is what we know about the avacado: ${textIn}.\n CreatedOn ${Date.now()}`;
//fs.writeFileSync('./txt/output.txt', textOut)
//console.log('File written');

// Non-Blocking, Asynchronous
//fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
//    fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
//        console.log(data2);
//        fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
//            console.log(data3);
//
//            fs.writeFile('./txt/final.txt',`${data2}.\n ${data3}`,'utf-8', err => {
 //               console.log('Your file has been written')
 //           })
   //     });
//    });
//});
////////////////////////////
///// Server
const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8')
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8')
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8')
//This will only execute once right at the biginin
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8')
const dataObj = JSON.parse(data);
 //this is the top-level code which runs outside the callback funct

const server = http.createServer((req, res) => {

  const { query, pathname } = url.parse(req.url, true )
// Overview page 
  if(pathname === '/' || pathname === '/overview') {
//el hold the elements of the data and replaces it with our place holder in the html files by using map()
    const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml)
    res.writeHead(200, { 'Content-type': 'text/html'})
    res.end(output)


// Product page
  } else if (pathname === '/product') {
    res.writeHead(200, { 'Content-type': 'text/html'})
    const product = dataObj[query.id] // throw data based on the id
    const output = replaceTemplate(tempProduct, product)
    res.end(output)
  } else if (pathname === '/api') {
    res.writeHead(200, { 'Content-type': 'application/json'})
    res.end(data);
  } else {
    res.writeHead(404, {
      'Content-type':'text/html',
      'my-own-header':'hello-world'
    });
    res.end('<h1>Page not found!!</h1>');
  }
  
});

server.listen(8000, '127.0.0.1', () => {
  console.log('Listening to requests on port 8000');
});
