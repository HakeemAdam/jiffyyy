import React, { Component } from 'react';
import loader from './images/loader.svg';
import Gif from './Gif';
import clear from './images/close-icon.svg';

const randomChoice = arr => {
  const randIndex = Math.floor(Math.random() * arr.length);
  return arr[randIndex];
};

const Header = ({ clearSearch, hasResults }) => (
  <div className="header grid">
    {hasResults ? (<button onClick={clearSearch}> <img src={clear} alt="Clear" /> </button>) : (<h1 className="title" >
      Jiffyyy
    </h1>)}

  </div>
);

const UserHint = ({ loading, hintText }) => (
  <div className="user-hint">
    {loading ? <img src={loader} className="block mx-auto" alt="Loading..." /> : hintText}
  </div>
);




class App extends Component {

  constructor(props) {
    super(props);
    this.textInput = React.createRef();
    this.state = {
      loading: false,
      searchTerm: '',
      hintText: '',
      gifs: []
    };
  }

  searchGiphy = async searchTerm => {

    this.setState({
      loading: true
    });

    try {
      const response = await fetch(
        `https://api.giphy.com/v1/gifs/search?api_key=xR8kLkykEuWaSPtKsnmpP6KZeSAS59Jz&q=${searchTerm
        }&limit=50&offset=0&rating=PG-13&lang=en`
      );
      const { data } = await response.json();

      if (!data.length) {
        throw `Nothing found for ${searchTerm}`
      }

      const randomGif = randomChoice(data);
      this.setState((prevState, props) => ({
        ...prevState,
        gifs: [...prevState.gifs, randomGif],
        loading: false,
        hintText: `Hit Enter to see more ${searchTerm}`
      }));

    } catch (error) {
      this.setState((prevState, props) => ({
        ...prevState,
        hintText: error,
        loading: false,
      }))
      console.log(error);

    }
  };

  handleChange = event => {
    const { value } = event.target;
    this.setState((prevState, props) => ({
      ...prevState,
      searchTerm: value,
      hintText: value.length > 2 ? `Hit Enter to Search ${value}` : ''
    }));
    if (value.length > 2) {
    }
  };


  handleKeyPress = event => {
    const { value } = event.target;
    if (value.length > 2 && event.key === 'Enter') {
      this.searchGiphy(value);
    }
  };

  clearSearch = () => {
    this.setState((prevState, props) => ({
      ...prevState,
      searchTerm: '',
      hintText: '',
      gifs: []
    }));
    this.textInput.current.focus();
  };




  render() {
    const { searchTerm, gifs } = this.state;
    const hasResults = gifs.length

    return (
      <div className="page">
        <Header clearSearch={this.clearSearch} hasResults={hasResults} />

        <div className="search grid">

          {this.state.gifs.map(gif => (
            < Gif {...gif} />
          ))}

          <input className="input grid-item" placeholder="Type Something"
            onChange={this.handleChange}
            onKeyPress={this.handleKeyPress}
            value={searchTerm}
            ref={this.textInput}
          />
        </div>
        <UserHint {...this.state} />
      </div>
    );
  }
}

export default App;
