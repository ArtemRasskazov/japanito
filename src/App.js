import React from 'react';
import ProductCard from './app/ProductCard'
import Header from './app/Header'
import Navigation from './app/Navigation'
import Footer from './app/Footer'
import productDataBase from './data/products.json'
import productCategories from './data/categories.json'

import 'font-awesome/css/font-awesome.min.css'

import sushi_main from './data/sushi_main.png'

// TODO: languages support
// - [ ] Create DB for all texts
// - [ ] Parse DB in statement
// - [ ] Replace texts to statement

// FIXME: Problems when zooming
// IDEA: Make documentation

let space = (document.documentElement.clientWidth-1024) / 2;
let root = document.querySelector(':root');
root.style.setProperty('--padding', `${space}px`);

const styles = {
  bannerImage: {
    backgroundImage: `url(${sushi_main})`
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);

//  IDEA: Phone number and copiright as variables

    this.state = {
      locale: {
        lang: 'eng',
        name: 'name',
        description: 'description',
        g: 'g.',
        cities: {
          moscow: 'Moscow',
          stPetersburg: 'St. Petersburg',
          omsk: 'Omsk'
        }
      },
      currentCity: 'moscow',
      cities: {
        moscow: 'Moscow',
        stPetersburg: 'St. Petersburg',
        omsk: 'Omsk'
      },
      cities_ru: {
        moscow: 'Москва',
        stPetersburg: 'Санкт Петербург',
        omsk: 'Омск'
      },
      userName: 'Login',
      maxValueForOrder: 12,
      totalCost: 0,
      orderVisibility: { visibility: 'hidden' }, // visible / hidden
      orderList: {},
      costList: {}
    };

    this.makeCatalog = this.makeCatalog.bind(this);
    this.makeHeading = this.makeHeading.bind(this);
    this.setOrder = this.setOrder.bind(this);
    this.setOrderVisible = this.setOrderVisible.bind(this);
    this.setRegion = this.setRegion.bind(this);
  }

  setRegion(value) {
  // QUESTION: Why it event doesn't work when I used input radio?
  // <input type="radio"
  //        name="langSelector"
  //        value="eng"
  //        onChange={props.setRegion}
  //        checked={props.lang === 'eng'} />
  // Now I use just button and onClick

  // TODO: separate set city and set locale (ENG by default)
  // TODO: rewrite eng/ru to uppercase

    let locale = this.state.locale;

    switch (value) {
      case 'ru':
        locale.lang = 'ru'
        locale.name = 'name_ru'
        locale.description = 'description_ru'
        locale.g = 'г.'
        locale.cities = this.state.cities_ru

        this.setState({locale: locale});
        break;

      case 'eng':
        locale.lang = 'eng'
        locale.name = 'name'
        locale.description = 'description'
        locale.g = 'g.'
        locale.cities = this.state.cities

        this.setState({locale: locale});
        break;

      default:
        if (this.state.cities.hasOwnProperty(value.target.value)) {
          this.setState({currentCity: value.target.value});
        }
        console.log('Current city: ', this.state.currentCity);
    }
  }

  setOrder(product, prise, op) {
    let orderList = this.state.orderList;
    let costList = this.state.costList;
    let totalCost = this.state.totalCost;

    switch (op) {
      case 'ink':
        if (typeof(orderList[product]) !== 'number') {
          orderList[product] = 0;
          costList[product] = 0;
        };

        orderList[product] = orderList[product] + 1;
        costList[product] = costList[product] + prise;
        totalCost = totalCost + prise;

        break;
      case 'dec':
        orderList[product] = orderList[product] - 1;
        costList[product] = costList[product] - prise;
        totalCost = totalCost - prise;

        if (orderList[product] === 0) {
          delete orderList[product];
          delete costList[product];
        }

        break;
      case 'clr':
        totalCost = totalCost - ( orderList[product] * prise );
        delete orderList[product];
        delete costList[product];

        break;
      default:
        return console.error("Valid third argumet are: 'ink', 'dec' or 'clr'");
    }

    this.setState({orderList: orderList})
    this.setState({costList: costList})
    this.setState({totalCost: totalCost})
  }

  setOrderVisible(visible) {
    let orderVisibility = visible ?
                          { visibility: 'visible' } :
                          { visibility: 'hidden' } ;

    this.setState({orderVisibility: orderVisibility})
  }

  makeOrder() {
    let productsByCategories = Object.keys(productDataBase).map(category => {
        let product = productDataBase[category].map(productData => {
          if (this.state.orderList[productData.id] !== undefined) {
            return (
              <li key={productData.id}>
                <ProductCard productData={productData}
                    value={this.state.orderList[productData.id]}
                    maxValue={this.state.maxValueForOrder}
                    setOrder={this.setOrder}
                    cost={this.state.costList[productData.id]}/>
              </li>
            )
          } else {
            return undefined;
          }
        })

        return product
    })

    return (
      <div className="Order" style={this.state.orderVisibility}>
        <h2>Ваш заказ

          <button type="button"
                  className="closeOrderListButton"
                  onClick={() => (this.setOrderVisible(false))} >
            <i className="fa fa-times red" />
          </button>
        </h2>

        <ul className="OrderList">
          {productsByCategories}
        </ul>

{/* FIXME: set margin-left for checkoutButton (center) and Total cost */}
        <h1>
          Total cost: <strong>{this.state.totalCost} <i className="fa fa-rub" /></strong>
      </h1>

        <input type="button"
               value="Checkout"
               className="checkoutButton red"
               disabled={!(this.state.totalCost > 0)} />  {/* may be undefined */}
      </div>
    )
  }

  makeCatalog() { //build list of products from productDataBase (sorted by categories)
    let productsByCategories = Object.keys(productDataBase).map(category => {

        // TODO: figure out how to localize categoryName
        let categoryName = category;

        let product = productDataBase[category].map(productData => {
          return (
            <li key={productData.id}>
              <ProductCard productData={productData}
                  name={this.state.locale.name}
                  description={this.state.locale.description}
                  g={this.state.locale.g}
                  value={this.state.orderList[productData.id]}
                  maxValue={this.state.maxValueForOrder}
                  setOrder={this.setOrder}/>
            </li>
          )
        })

        return (
          //if key in productDataBase consist more than one word it crash?
          <li key={category} id={category}>
            <h2>
              {categoryName}
            </h2>
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
        <li key={category.name} style={liIcon}>
          <a href={hrefID}>
            <h2>
              {category[this.state.locale.name]}
            </h2>
          </a>
        </li>
      )
    })

    return (
      <ul className="ListOfCategories">
        {categories}
      </ul>
    )
  }

  makeBanner() {
    let message, buttonValue;

    switch (this.state.locale.lang) {
      case 'ru':
        message = (
            <p>
              Бесплатная доставка при заказе
              <span> от 800 руб.</span>
            </p>
          )

        buttonValue = 'Перейти к заказу';
        break;

      default:
        message = (
          <p>
            Free shipping on orders
            <span> over 800 rubles.</span>
          </p>
        );

        buttonValue = 'Go to order';
    }

    return (
      <div className="Banner" style={styles.bannerImage}>
        <Navigation lang={this.state.locale.lang}/>
        {message}
        <button className="red">{buttonValue}</button>
      </div>
    )
  }

  render() {
    return (
      <div className="App" style={styles.app}>
        <Header lang={this.state.locale.lang}
                currentCity={this.state.currentCity}
                cities={this.state.locale.cities}
                userName={this.state.userName}
                totalCost={this.state.totalCost}
                makeOrder={this.makeOrder}
                setOrderVisible={this.setOrderVisible}
                setRegion={this.setRegion}/>

        {this.makeBanner()}
        {this.makeHeading()}
        {this.makeCatalog()}
        {this.makeOrder()}

        <Footer lang={this.state.locale.lang}/>
      </div>
    );
  }
}

export default App;
