import React from "react";
import { Component } from "react";
import "./Twall.css"
import {BiHome} from "react-icons/bi"
import {BiUserCircle} from "react-icons/bi"
import {BiLogOut} from "react-icons/bi"
import {BiMessage} from "react-icons/bi"
import logo from "./Bird.png"
import axios from "axios";
axios.defaults.withCredentials = true;

class BarInfo extends Component{
    constructor(props){
        super(props)
        this.hoverInfo = this.hoverInfo.bind(this)
        this.leaveInfo = this.leaveInfo.bind(this)
        this.logout = this.logout.bind(this)
    }

    hoverInfo(val){
        document.getElementById(val).style.visibility= "visible"
    }
    leaveInfo(val){
        document.getElementById(val).style.visibility = "hidden"
    }

    logout(){
        axios.delete('https://devopsproject.cyclic.app/api/user/logout',{/**/},{withCredentials : true})
        .then((res) => {
            if (res.data.status === 200) this.props.logout()
        })
        .catch((err) => console.log(err))
    }

    render(){
        return <div className="infoContener">
            <div id="toColor" className="iconContener">
                <img src={logo} id="logoInfo" alt="logo"/>
                <BiHome id="home1" className="iconBarInfo" onClick={() =>this.props.goToTwall()}/>
                <BiUserCircle id="user1" className="iconBarInfo" onClick={() =>this.props.goToProfil(this.props.login)} />
                <BiMessage id="message1" className="iconBarInfo" />
                <BiLogOut id="logout1" className="iconBarInfo" onClick={this.logout}/>
            </div>
        </div>
    }
}
export default BarInfo