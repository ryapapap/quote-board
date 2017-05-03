import React, { Component } from 'react';
import backgrounds from './backgrounds.js';
import quotes from './quotes.js';
import './App.css';

/* TODO:
  2. Get a better font
  3. CSS Transitions??
  4. Mobile sucks
*/

function randomItem(arr) {
  return arr[Math.floor(Math.random()*arr.length)]
}

function setBackground(htmlThing) {
  const background = randomItem(backgrounds);
  htmlThing.style.backgroundImage = `url(${background})`;
}

class QuoteContainer extends Component {
  componentWillMount() {
    this.setDuration(this.props);
    this.firstFrame = true;
  }

  componentWillReceiveProps(nextProps) {
    // it'd probably be better to try and figure
    // out how long the timer has already ran first
    clearInterval(this.interval);
    this.setDuration(nextProps);
  }

  setDuration = (props) => {
    this.interval = setInterval(() => this.forceUpdate(), props.duration * 1000);
  }

  render() {
    // we need to dual buffer up this bitch
    const frame1 = document.getElementById('frame1');
    const frame2 = document.getElementById('frame2');

    if (frame1 && frame2) {
      if (this.firstFrame) {
        frame1.style.display = 'initial';
        
        setBackground(frame2);
        frame2.style.display = 'none';
      } else {
        frame2.style.display = 'initial';

        setBackground(frame1);
        frame1.style.display = 'none';
      }

      this.firstFrame = !this.firstFrame;
    }
    
    const toUse = randomItem(quotes);
    return (<Quote 
      quote={toUse[0]}
      author={toUse[1]}
    />);
  }
}


class Quote extends Component {
  render() {
    return (<div className="container">
        <div className="quote">{this.props.quote}</div>
        <div className="author">{this.props.author}</div>
      </div>);
  }
}

class App extends Component {
  state = {
    duration: 15,
  }

  setDuration = (event) => {
    this.setState({ duration: event.target.value });
  }

  render() {
    // for first frame
    setBackground(document.body);

    return (
      <div className="App">
        <QuoteContainer 
          duration={this.state.duration}
        />

        <div id="frame1" className="frame" />
        <div id="frame2" className="frame" />

        <div className="duration-slider">
          <label htmlFor="duration">Duration</label>
          <input 
            id="duration" 
            type="range" 
            min="1" 
            max="60" 
            value={this.state.duration} 
            onChange={this.setDuration} 
          />
        </div>
      </div>
      
    );
  }
}

export default App;
