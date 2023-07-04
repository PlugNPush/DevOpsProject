import React from "react";
import { Component } from "react";
import "./Start.css"
import logo from "./Bird.png"

class Start extends Component{

    render(){
        return <div class="parent">
        <div class="div1"> 
            <img id="LogoStart" src={logo} alt="Logo"/>
        </div>
        <div class="div2"> 
            <h1 id="APPNAME">KWITTER</h1>
        </div>
            <div class="div3">
                <button id="bIns" className="bn30" onClick={() =>this.props.toLOG(true)}>Connexion</button>
                <button id="bCo" className="bn30" onClick={() =>this.props.toLOG(false)}>Inscription</button>
            </div>
        </div>
    }
}

export default Start