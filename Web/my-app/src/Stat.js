import React from "react";
import { Component } from "react";
import axios from "axios";
axios.defaults.withCredentials = true;

class Stat extends Component{
    constructor(props){
        super(props)
        this.state = {NumFollow : 0,nbMessages : 0,nbLikers : 0,isDerouled:false}
        this.getNbFollowers = this.getNbFollowers.bind(this)
        this.getNbLikers = this.getNbLikers.bind(this)
        this.onClick = this.onClick.bind(this)
        this.getNbMessages = this.getNbMessages.bind(this)
    }

    componentDidMount(){
        this.getNbFollowers()
        this.getNbLikers()
        this.getNbMessages()
    }

    getNbFollowers(){
        axios.get("http://localhost:4000/api/friend/followers/"+this.props.login,{},{withCredentials : true})
        .then((res) => {
            this.setState({NumFollow : res.data.nbFollowers})
        })
        .catch((err) => console.log(err))
    }

    getNbMessages(){
        axios.get("http://localhost:4000/api/messages/user/"+this.props.login+"/stats",{},{withCredentials : true})
        .then((res) => {
            this.setState({nbMessages : res.data.count})
        })
        .catch((err) => console.log(err))
    }
    getNbLikers(){
        axios.get("http://localhost:4000/api/messages/nblikers/"+this.props.login, {}, {withCredentials : true})
        .then((res)=>{
            this.setState({nbLikers : res.data.nbLikes})
        })
        .catch((err) => {
            console.log(err)
        })
    }
    arrow(){
        if (this.state.isDerouled){
            return <button id="friendList" className="bn30" onClick={() => this.onClick() }>Cacher les infos</button>
        }
        else{
            return <button id="friendList" className="bn30" onClick={() => this.onClick() }>Afficher les infos</button>
        }
    }
    onClick(){
        this.setState({isDerouled:!this.state.isDerouled})
    }

    printInfo(){
        if (this.state.isDerouled){
            return <div className="toColorInfo"><div className="infoTextProfil"><p className="borderInfo"> Followers : {this.state.NumFollow}</p><p>Likes : {this.state.nbLikers}</p> <p>Messages : {this.state.nbMessages}</p></div></div>
        }
    }
    render(){
        return <div className="infoProfilButton">{this.arrow()}{this.printInfo()}</div>
    }
}

export default Stat