import React from 'react';
import PlayRandomMove from '../randomMove';
import './../css/home.css';

function About() {
  return(
      <div id="about">
        <div id="upper"><h4>About Us</h4></div>
        <div>This is a Chess.com clone for our Sem-3 WebTech Project.<br/><br/>This is made by:<br/>Advaith Srinivas<br/>Abhinav S Kokrady<br/>Amitesh Jammula</div>
      </div>
  ) 
}

function Home(){
  return (
    <div id="main">
        <div>
          <PlayRandomMove/>
        </div>
        <About/>
    </div>
  );
}

export default Home