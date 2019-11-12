var inquirer = require('inquirer');
var mysql = require('mysql');

const cTable = require('console.table');
console.table([
  {
    name: 'foo',
    age: 10
  }, {
    name: 'bar',
    age: 20
  }
]);

var connection = mysql.createConnection({
    host: "localhost",
    port: "3306",
    user: "root",
    password: "password",
    database: "bamazon"
});

connection.connect(function (err, res) {
    if (err) {
        throw err;
    } else {

    }
})

connection.query("SELECT * FROM product", function (err, result) {
    if (err) {
        throw err;
    }


    console.table(result);
    var choices = [];
    for (var i = 0; i < result.length; i++){
        choices.push(result[i].item_id + '');
    }

    inquirer.prompt([{
                type: "list",
                message: "What item would you like to buy?",
                name: "item_id",
                choices:choices
            },
            {
                type: "input",
                message: "How many would you like to buy?",
                name: "quantity"
            }
        ])
        .then(function (answers) {
            connection.query("SELECT * FROM product WHERE item_id = ?", [answers.item_id], function (err, result) {
                if (err) {
                    throw err;
                }
                var quantity = result[0].stock_quantity;
                var price = result[0].price;
                var product_sales = result[0].product_sales;
                if (answers.quantity > quantity) {
                    console.log('Not Enough in Stock')
                } else {
                    connection.query("UPDATE product SET ? WHERE item_id = ?", [{
                        stock_quantity: quantity - answers.quantity,
                        product_sales: product_sales + (price * answers.quantity)
                    }, answers.item_id], function (err, result) {
                        if (err) {
                            throw err;
                        }
                        console.log('Your purchase cost you : $' + (price * answers.quantity));

                    })
                }

            })

        });
})