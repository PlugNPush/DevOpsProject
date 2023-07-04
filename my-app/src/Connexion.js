import React from "react";
import { Component } from "react";
import "./Start.css"
import logo from "./Bird.png"
import LoginForm from "./Loginform";
import SigninForm from "./SigninFrom"

class Connexion extends Component{


    conexOrIns(){
        if (this.props.connec){
            return <LoginForm checkCo={this.props.checkCo} goBack={this.props.goBack}/>
        }
        else return <SigninForm goBack={this.props.goBack}/>
    }



    render(){
        return <div id="CoPar" class="parent">
        <div class="div1"> 
            <img id="LogoStart" src={logo} alt="Logo"/>
        </div>
        <div class="div2"> 
            <h1 id="APPNAME">KWITTER</h1>
        </div>
            <div class="div4">
                {this.conexOrIns()}
            </div>
        </div>
    }
}

export default Connexion