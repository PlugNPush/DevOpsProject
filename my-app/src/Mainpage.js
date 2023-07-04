import React from "react";
import { Component } from "react";
import Connexion from "./Connexion";
import Start from "./Start";
import axios from "axios";
import Twall from "./Twall"
axios.defaults.withCredentials = true;

class Mainpage extends Component{
    constructor(props){
        super(props)
        this.state = {page : 'start'}
        this.toLogin = this.toLogin.bind(this)
        this.toStart = this.toStart.bind(this)
        this.getConnected = this.getConnected.bind(this);
        this.checkConnected = this.checkConnected.bind(this)
        this.logout = this.logout.bind(this)        
    }
    componentDidMount(){
        this.setState({page : 'start'})
        document.title = "Kwitter"
        this.checkConnected()
        this.getLogin()
    }
    getLogin(){
        axios.get("http://localhost:4000/api/user",{},{withCredentials : true})
        .then((res) => {
            this.setState({Mylogin : res.data.login})
        })
        .catch((err) => console.log(err))
    }
    checkConnected(){
    axios.get('http://localhost:4000/api/user/check/isConnected',{/**/},{withCredentials : true})
        .then((res) => {
            if (res.data.connected){
                console.log(res.data)
                this.getConnected()
            }
        }
    )}
    getConnected() {
        this.getLogin()
        this.setState({ page: "Twall", isConnected: true ,keyword : undefined});
    }
    toLogin(val){
        this.setState({page : 'login',co : val})
    }

    logout(){
        this.setState({page : 'start',isConnected: false})
    }

    toStart(){
        this.setState({page : 'start'})
    }

    selectPage(){
        console.log(this.state.page)
        if (this.state.page === 'start'){
            return <Start toLOG={this.toLogin}/>
        }
        else if (this.state.page === "login"){
            return <Connexion checkCo={this.checkConnected} goBack={this.toStart} connec={this.state.co}/>
        
        }
        else {
            return <Twall logout={this.logout} login={this.state.Mylogin}/>
        }
    }
    render(){
        return <div>{this.selectPage()}</div>
    }


}

export default Mainpage