import React from "react";
import Axios from "axios";
import Table2 from "./table2";
import FuzzySearch from "fuzzy-search";
import { ActionYoutubeSearchedFor } from "material-ui/svg-icons";

//when you enter instead of clicking on an  Autofilling from the drop down menu
//then get the id for the top   Autofilling which will be this.state  Autofilling[0]
class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      input: "", //current state of search bar
      items: [], //names of items
      Autofilling: [], //items that will be render below the search bar
      qty: 0
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSelection = this.handleSelection.bind(this);
    this.handleKey = this.handleKey.bind(this);
    this.randomItem = this.randomItem.bind(this);
    this.handleKillerDeals = this.handleKillerDeals.bind(this);
    this.getSuggestions = this.getSuggestions.bind(this);
  }

  handleCart(e) {
    e.preventDefault();
    window.dispatchEvent(
      new CustomEvent("showCart", {
        detail: {
          showCart: true
        }
      })
    );
  }

  autoComplete(input, cb) {
    let items = this.state.items;

    const findClosestItem = new FuzzySearch(items, [], {
      caseSensitive: false,
      sort: true
    });

    let allItemsThatAreClose = findClosestItem.search(input); //will be the input
    const foundItem = allItemsThatAreClose[0];

    cb(null, foundItem);
  }

  handleSubmit(e, selectedOnDropdown) {
    let target = e;

    if (!selectedOnDropdown) {
      target = this.state.input;
      this.autoComplete(target, (err, suc) => {
        if (err) {
          console.log("didnt worko");
        } else {
          target = suc;
          this.setState({ input: "" }); //will only clearn input if entered or searched, but wont clear if sleected fotm dropdown
        }
      });
    }

    window.dispatchEvent(
      new CustomEvent("showCart", {
        detail: {
          showCart: false
        }
      })
    );
    console.log(target);

    Axios.get(`/find?name=${target}`)
      .then(response => {
        const id = response.data[0].productID;
        console.log(id);

        window.dispatchEvent(
          new CustomEvent("productChanged", {
            detail: {
              id: id
            }
          })
        );
        return id;
      })
      .then(id => {
        Axios.post(`/items`, {
          id: id
        });
      })
      .catch(err => console.log(err));
  }

  // "http://ec2-18-212-65-184.compute-1.amazonaws.com:3001/items"

  componentDidMount() {
    window.addEventListener("updateQty", e =>
      this.setState({ qty: e.detail.totalQty })
    );
    // Axios.get("/items") //recieving all names from all the Autofilling names
    //   .then(response => {
    //     this.setState({ items: response.data });
    //   })
    //   .catch(err => console.log("ERR", err));
  }

  getSuggestions(searchTerm) {
    console.log(searchTerm);
    return Axios.get(`/items?search=${searchTerm}`);
  }

  handleSelection(e) {
    const searchTerm = e.target.value;
    this.setState({ input: searchTerm });
    this.getSuggestions(searchTerm)
      .then(response => {
        console.log("response says, ", response);
        this.setState({ items: response.data });
        return response.data;
      })
      .then(data => {
        if (data.includes(searchTerm)) {
          this.handleSubmit(searchTerm, true);
        } else {
          null;
        }
      })
      .catch(err => console.log("error! error! ", err));
  }

  handleKey = e => {
    if (e.key === "Enter") {
      this.handleSubmit();
    }
  };

  handleKillerDeals() {
    const killerDeals =
      "Rudolph The Red Nose Reindeer Light Up Christmas Santa Hat Cap Holiday New";
    // this.handleSubmit(killerDeals, true);
  }

  randomItem() {
    const randomPos = parseInt(Math.random() * 100);
    const randomItem = this.state.items[randomPos];

    // this.handleSubmit(randomItem, true); //true will mean that in handle submit it wont try to take the input, and instead, take the random item from click
  }

  render() {
    return (
      <div>
        <div className="top-bar">
          <ul className="top">
            <li className="user">
              <span className="span-user">
                Hi <b>User</b> (
                <a className="signin" href="#">
                  Sign in
                </a>
                ){" "}
              </span>
            </li>
            <li className="Daily-Deals">
              <span className="span-dailydeals">Daily Deals</span>
            </li>
            <li className="Gift-Cards">
              <span className="span-giftcards">Gift Cards</span>
            </li>
            <li className="Help-Contact">
              <span className="span-help">Help & Contact</span>
            </li>
            <li className="deals">
              <img
                id="deals"
                src="https://ir.ebaystatic.com/cr/v/c1/61203_071519__GG_SM_HRZ_RW29_GenericPrimeMsg_Doodle_150x30_R1.gif"
                // onClick={this.handleKillerDeals}
              ></img>
            </li>
          </ul>
          <ul id="right-top">
            <li className="sell">
              <span className="span-sell">sell</span>
            </li>
            <li className="my-ebay">
              <span className="span-My">My ZBay</span>
            </li>
            <li className="notifications">
              <button className="bell-icon">
                <i id="alert"></i>
              </button>
            </li>
            <li className="Search-cart">
              <a className="cart-icon" onClick={this.handleCart}>
                <i id="shop">
                  {this.state.qty !== 0 ? (
                    <p id="qty" title="your cart has">
                      {this.state.qty}
                    </p>
                  ) : null}
                </i>
              </a>
            </li>
          </ul>
        </div>
        <div className="Search-component">
          <div className="w4-white">
            <img
              id="Search-Zbay-logo"
              src="https://searchcomponent.s3.us-east-2.amazonaws.com/searchpngs/Zbay.png"
              onClick={this.randomItem}
            ></img>

            <div className="w3-dropdown-hover">
              <button className="category-dropdown" aria-expanded="false">
                Shop by{" "}
                <p rowSpan="3">
                  category<i id="arrow-dropdown"></i>
                </p>
              </button>
              <div className="w3-dropdown-content">
                <table id="drop">
                  <tbody>
                    <tr>
                      <th>
                        Collectibles and art{" "}
                        <i id="arrow" className="right"></i>
                      </th>
                      <th>
                        Fashion<i id="arrow" className="right"></i>
                      </th>
                      <th>
                        Sporting goods<i id="arrow" className="right"></i>
                      </th>
                    </tr>
                    <tr>
                      <td>Collectibles</td>
                      <td>Women</td>
                      <td>Outdoor sports</td>
                    </tr>
                    <tr>
                      <td>Coins & paper money Antiques</td>
                      <td>Men</td>
                      <td>Team sports</td>
                    </tr>
                    <tr>
                      <td>Antiques</td>
                      <td>Watches</td>
                      <td>Exercise & fitness</td>
                    </tr>
                    <tr>
                      <td>Sports memorabillia</td>
                      <td>Shoes</td>
                      <td>Golf</td>
                    </tr>
                    <tr>
                      <th rowSpan="1">
                        Electronics<i id="arrow" className="right"></i>
                      </th>
                      <th rowSpan="1">
                        Home & Garden<i id="arrow" className="right"></i>
                      </th>
                      <th rowSpan="1">
                        Toys & Hobbies<i id="arrow" className="right"></i>
                      </th>
                    </tr>
                    <tr>
                      <td>Computers & tables</td>
                      <td>Yard, garden & outdoor</td>
                      <td>Vintage & anitques toys</td>
                    </tr>
                    <tr>
                      <td>Cameras & photos</td>
                      <td>Crafts</td>
                      <td>Kids toys</td>
                    </tr>
                    <tr>
                      <td>TV, audio & surveillance</td>
                      <td>Home improvement</td>
                      <td>Action figures</td>
                    </tr>
                    <tr>
                      <td>Cell phones & accessories</td>
                      <td>Pet supplies</td>
                      <td>Dolls & bears</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <input
              id="search"
              onChange={this.handleSelection}
              onKeyPress={this.handleKey}
              onClick={this.hideDropdown}
              value={this.state.input}
              list="item-names"
              className="Searchbar"
              type="text"
              placeholder="Search for anything"
            ></input>
            <datalist id="item-names">
              <select>
                {this.state.items.map((name, i) => {
                  return (
                    <option id="item" key={i} value={name}>
                      {name}
                    </option>
                  );
                })}
              </select>
            </datalist>
            <select className="dropdown">
              <option value="All Categories">All Categories</option>
              <option value="Antiques">Anitques</option>
              <option value="Ar">Art</option>
              <option value="Baby">Baby</option>
              <option value="Books">Books</option>
              <option value="Business & Industrial">
                Business & Industrial
              </option>
              <option value="Cameras & photos">Cameras & photos</option>
              <option value="Cell phone & accessories">
                Cell phone & accessories
              </option>
            </select>
            <button className="Search" onClick={this.handleSubmit}>
              Search
            </button>
            <div className="showcontent"></div>
            {<Table2 />}
          </div>
        </div>
      </div>
    );
  }
}

export default Search;
