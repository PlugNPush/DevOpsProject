import React from "react";
import { Component } from "react";
import axios from "axios"
axios.defaults.withCredentials = true

class ListFriend extends Component{
    constructor(props){
        super(props)
        this.state = {isDerouled:false, friend: []}
        this.onClick = this.onClick.bind(this)
        this.friend = this.friend.bind(this)
        
    }
    componentDidMount(){
        this.friend()
    }
    onClick(){
        this.setState({isDerouled:!this.state.isDerouled})
    }

    friend(){
        axios.get("http://localhost:4000/api/friend/user/"+this.props.login+"/friends",{/**/},{withCredentials : true})
        .then((res) => {
            this.setState({friend : res.data.listFriend})
        })
        .catch((err) => {
            this.setState({friend : []})
        })
    }

    printfriend(){
        if (this.state.isDerouled){
            return this.state.friend.map((login) => (
                <button id="friendButt" className="bn39" key={login} login={login} onClick={() => this.props.goToProfil(login)}><span class="bn39span">{login}</span></button>
            ))
        }
    }

    arrow(){
        if (this.state.isDerouled){
            return <button id="friendList" className="bn30" onClick={() => this.onClick() }>Cacher les amis</button>
        }
        else{
            return <button id="friendList" className="bn30" onClick={() => this.onClick() }>Afficher les amis</button>
        }
    }

    render(){
        return <div>
            <div id="ProfilArrow">
            {this.arrow()}
            </div>
            <div className="friend">
                {this.printfriend()}
            </div>
            </div>
    }
}

export default ListFriend