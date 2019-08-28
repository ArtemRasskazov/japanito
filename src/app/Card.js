import React from 'react';
import ProductCard from './app/ProductCard'
import Header from './app/Header'

import productDataBase from './data/products.json'
import productCategories from './data/categories.json'


let space = (document.documentElement.clientWidth-1024) / 2;

const styles = {
  app: {
    paddingLeft: space,
    paddingRight: space,
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      lang: 'ENG',
      cities: ['St. Petersburg', 'Moscow', 'Omsk', 'California'],
      userName: 'Login',
      maxValueForOrder: 12,
      totalCost: 0,
      orderList: {},
      phoneNumber: '8-800-900-500-5'
    };

    this.makeCatalog = this.makeCatalog.bind(this);
    this.makeHeading = this.makeHeading.bind(this);
    this.setOrder = this.setOrder.bind(this);
  }

  setOrder(product, op) {
    let orderList = this.state.orderList;
    switch (op) {
      case 'ink':
        if (typeof(orderList[product]) !== 'number') {orderList[product] = 0};

        orderList[product] = orderList[product] + 1;

        break;
      case 'dec':
        orderList[product] = orderList[product] - 1;

        if (orderList[product] === 0) {delete orderList[product]}

        break;
      default:
        return console.error("Valid second argumet are: 'ink', 'dec'");
    }

    this.setState({orderList: orderList})
  }

  makeCatalog() { //build list of products from productDataBase (sorted by categories)
    let productsByCategories = Object.keys(productDataBase).map(category => {
        let product = productDataBase[category].map(productData => {
          return (
            <li key={productData.id}>
              <ProductCard productData={productData}
                  value={this.state.orderList[productData.id]}
                  maxValue={this.state.maxValueForOrder}
                  setOrder={this.setOrder}/>
            </li>
          )
        })

        return (
          <li key={category} id={category}> {category}
            <ul className="ListOfProducts">
              {product}
            </ul>
          </li>
        )
    })

    return (
      <ul className="ProductsByCategories">
        {productsByCategories}
      </ul>
    )
  }

  makeHeading() {
    let categories = productCategories.map(category => {
      let hrefID = "#" + category.name; //id <li> with category name generated by makeCatalog()
      let liIcon = {backgroundImage: `url(${category.icon})`}

      return (
        <a key={category.name} href={hrefID}>
          <li style={liIcon}> {category.name} </li>
        </a>
      )
    })

    return (
      <ul className="ListOfCategories">
        {categories}
      </ul>
    )
  }

  render() {
    return (
      <div className="Card">
        {this.makeHeading()}
        {this.makeCatalog()}
      </div>
    );
  }
}

export default Card;
